import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendEmail, renderReceivedEmail } from '@/lib/email'

export async function POST(request) {
  try {
    const formData = await request.json()
    console.log('Received form data:', formData)
    
    const applicationData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      age: formData.age,
      degree: formData.degree,
      degree_other: formData.degree_other || '',
      course: formData.course,
      course_other: formData.course_other || '',
      experience_years: formData.experience_years,
      experience_details: formData.experience_details,
      project: formData.project,
      resume_filename: formData.resume_filename,
      status: 'pending', // pending, reviewing, approved, rejected
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    console.log('Application data to insert:', applicationData)

    // Insert into applications table
    const { data, error } = await supabase
      .from('applications')
      .insert([applicationData])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }

    console.log('Successfully inserted application:', data[0])

    // Send confirmation email
    const applicant = data[0]
    if (applicant?.email) {
      console.log('Attempting to send confirmation email to:', applicant.email);
      try {
        const emailResult = await sendEmail({
          to: applicant.email,
          subject: 'We received your application',
          html: renderReceivedEmail({ firstName: applicant.first_name }),
        });
        console.log('Email result:', emailResult);
      } catch (e) {
        console.error('Send email error:', e);
      }
    } else {
      console.log('No email address found for applicant');
    }
    return NextResponse.json(
      { 
        success: true, 
        message: 'Application submitted successfully',
        applicationId: data[0].id 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    // Get all applications with pagination
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const status = searchParams.get('status')
    
    let query = supabase
      .from('applications')
      .select('*')
      .order('submitted_at', { ascending: false })
    
    if (status) {
      query = query.eq('status', status)
    }
    
    const from = (page - 1) * limit
    const to = from + limit - 1
    
    const { data, error, count } = await query
      .range(from, to)
      .select('*', { count: 'exact' })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      applications: data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    })

  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
