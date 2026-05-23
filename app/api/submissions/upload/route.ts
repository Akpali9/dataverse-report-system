import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/api-utils'
import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const assignmentId = formData.get('assignmentId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Upload to Vercel Blob
    const filename = `${assignmentId}/${user.id}/${Date.now()}-${file.name}`
    const blob = await put(filename, file, { access: 'private' })

    // Create submission record
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('submissions')
      .upsert(
        {
          assignment_id: assignmentId,
          student_id: user.id,
          file_url: blob.url,
          submission_date: new Date().toISOString(),
        },
        { onConflict: 'assignment_id,student_id' }
      )
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
