import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendEmail, renderDecisionEmail } from '@/lib/email'

// GET single application
export async function GET(request, { params }) {
  try {
    const { id } = params
    
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update application
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const updateData = await request.json()
    
    console.log('=== STATUS UPDATE DEBUG ===');
    console.log('Application ID:', id);
    console.log('Update data:', updateData);
    
    // Add updated timestamp
    const applicationData = {
      ...updateData,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('applications')
      .update(applicationData)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json(
        { error: 'Failed to update application' },
        { status: 500 }
      )
    }

    const updated = data[0]
    console.log('Updated application:', updated);
    console.log('Status:', updated.status);
    console.log('Email:', updated.email);
    
    if (updated?.email && (updated.status === 'approved' || updated.status === 'rejected')) {
      console.log('Sending decision email for status:', updated.status);
      console.log('Email recipient:', updated.email);
      
      try {
        const emailResult = await sendEmail({
          to: updated.email,
          subject: updated.status === 'approved' ? 'Your application is approved' : 'Application update',
          html: renderDecisionEmail({ firstName: updated.first_name, status: updated.status, project: updated.project }),
        });
        console.log('Decision email result:', emailResult);
      } catch (e) {
        console.error('Send decision email error:', e);
      }
    } else {
      console.log('No email sent - conditions not met');
      console.log('- Has email:', !!updated?.email);
      console.log('- Status is approved/rejected:', updated.status === 'approved' || updated.status === 'rejected');
    }

    console.log('=== STATUS UPDATE DEBUG END ===');
    return NextResponse.json(updated)

  } catch (error) {
    console.error('PUT route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete application
export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete application' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Application deleted successfully' },
      { status: 200 }
    )

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
