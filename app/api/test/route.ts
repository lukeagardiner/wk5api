//app/api/test/route.tsx
import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

// Test GET I guess
export async function GET() {
    return NextResponse.json({ message: 'this API loves CSE3CWA-CSE5007' });
}

// Test POST I guess
export async function POST(req: NextRequest, context: { params: { id: string }}) {
    const { id } = await req.json();

    if (!id) {
        // had to add this response init type to make the argument in the response definition valid
        /*
        const status400Response: globalThis.ResponseInit = {
            status: 400,
        };
        // modified this one-
        //return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        return NextResponse.json({ error: 'ID is required' }, status400Response );
        */
       //return NextResponse.json({ error: 'ID is required' }, { status: 400 } as globalThis.ResponseInit);
       //return NextResponse.json({ error: 'ID is required' }, { status: 400 });
       return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create a SHA-256 has of the Id
    const hash = createHash('sha256')
    .update(id)
    .digest('hex');

    return NextResponse.json({ hash });
}