import { connectToDatabase, disconnectDatabase } from '../../../server/db';
import { Registrant } from '../../../server/models';
import { NextResponse } from 'next/server';

export async function GET() {
	await connectToDatabase();
	const students = await Registrant.find({ confirmStatus: 'verified' }).limit(
		9
	);

	if (!students) {
		console.log('not found');
		return;
	}
	await disconnectDatabase();
	return NextResponse.json(students);
}
