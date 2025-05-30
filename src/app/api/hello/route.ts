// Rota API padrão para Vercel/Next.js
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'API funcionando!' });
} 