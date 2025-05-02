import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  // Fetch options from Supabase
  const { data: coffeeTypes, error: coffeeTypesError } = await supabase
    .from('coffee_types')
    .select('name')
    .order('name');

  const { data: brewMethods, error: brewMethodsError } = await supabase
    .from('brew_methods')
    .select('name')
    .order('name');

  if (coffeeTypesError || brewMethodsError) {
    return NextResponse.json(
      { error: 'Failed to fetch options' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    coffeeTypes: coffeeTypes.map(t => t.name),
    brewMethods: brewMethods.map(m => m.name),
    servingUnits: ['oz', 'ml', 'cup', 'shot'] // Can be made dynamic if needed
  });
}
