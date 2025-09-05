import { NextResponse } from 'next/server';
import { getSets, createSet, initializeData } from '@/lib/dataLayer';

// GET /api/sets - Get all sets
export async function GET() {
  try {
    await initializeData();
    const sets = await getSets();
    
    return NextResponse.json({
      success: true,
      count: sets.length,
      data: sets,
    });
  } catch (error) {
    console.error('Error retrieving sets:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve sets',
      },
      { status: 500 }
    );
  }
}

// POST /api/sets - Create new set
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: 'Set name is required',
        },
        { status: 400 }
      );
    }

    await initializeData();

    try {
      const newSet = await createSet({
        name,
        description: description || ''
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Set created successfully',
          data: newSet,
        },
        { status: 201 }
      );
    } catch (error) {
      if (error.message === 'Set already exists') {
        return NextResponse.json(
          {
            success: false,
            error: 'Set already exists',
          },
          { status: 409 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Error creating set:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create set',
      },
      { status: 500 }
    );
  }
}