import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = process.env.REVALIDATION_SECRET;

  // Prüfe das Secret für Sicherheit
  const url = new URL(req.url);
  const providedSecret = url.searchParams.get('secret');
  if (secret !== providedSecret) {
    return NextResponse.json({ message: 'Invalid revalidation secret' }, { status: 401 });
  }

  try {
    const path = url.searchParams.get('path') || '/';
    await fetch(`http://localhost:3000/api/revalidate?path=${path}&secret=${secret}`, {
      method: 'POST',
    });
    return NextResponse.json({ revalidated: true });
  } catch (err) {
    return NextResponse.json({ message: 'Revalidation failed' }, { status: 500 });
  }
}
