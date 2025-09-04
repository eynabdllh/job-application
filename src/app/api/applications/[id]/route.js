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
      return NextResponse.json(
        { error: 'Failed to update application' },
        { status: 500 }
      )
    }

    const updated = data[0]
    // If status changed to approved or rejected, notify applicant (fire-and-forget)
    if (updated?.email && (updated.status === 'approved' || updated.status === 'rejected')) {
      sendEmail({
        to: updated.email,
        subject: updated.status === 'approved' ? 'Your application is approved' : 'Application update',
        html: renderDecisionEmail({ firstName: updated.first_name, status: updated.status }),
      }).catch((e) => console.error('Send decision email error:', e))
    }

    return NextResponse.json(updated)

  } catch (error) {
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
