import { IMongoRegistrant } from '@/util/types';
import { Model, model, models, Schema } from 'mongoose';

const registrantSchema = new Schema<IMongoRegistrant>({
	fullName: { type: String },
	kName: { type: String },
	age: { type: Number },
	imageUrl: { type: String },
	sex: { type: String },
	phoneNo: { type: Number },
	isOwn: { type: Boolean },
	ownerName: { type: String },
	priesthood: { type: String },
	isNewStudent: { type: Boolean },
	registryDate: {
		year: { type: Number },
		month: { type: String },
		date: { type: Number },
	},
	classDetails: {
		classroom: { type: String },
		subject: { type: String },
		classTime: { type: String },
	},
	confirmStatus: { type: String, default: 'registered' },
	paymentId: { type: String },
	uniqueId: { type: String },
	verifiedDate: { type: Date },
});

export const Registrant: Model<IMongoRegistrant> =
	models.Registrant || model<IMongoRegistrant>('Registrant', registrantSchema);
