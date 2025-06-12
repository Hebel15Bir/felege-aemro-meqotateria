import { connectToDatabase, disconnectDatabase } from '../../../server/db';
import { Registrant } from '../../../server/models';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
	const { paymentId } = await params;

	await connectToDatabase();
	const students = await Registrant.find({
		paymentId: paymentId,
		confirmStatus: 'registered',
	});

	if (!students) {
		console.log('not found');
		return;
	}
	await disconnectDatabase();
	return NextResponse.json(students);
}
