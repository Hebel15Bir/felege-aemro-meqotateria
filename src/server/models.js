import { model, models, Schema } from 'mongoose';

const registrantSchema = new Schema({
	fullName: { type: String, required: [true, 'እባክዎ ሙሉ ስምዎን ያስገቡ።'] },
	kName: { type: String, required: [true, 'እባክዎ ክርስትና ስምዎን ያስገቡ።'] },
	age: {
		type: Number,
		required: true,
		validate: {
			validator: function (v) {
				return v !== 0;
			},
			message: 'እባክዎ ዕድሜዎን ያስገቡ።',
		},
	},
	photoUrl: { type: String, required: true },
	sex: { type: String, required: [true, 'እባክዎ ጾታዎን ያስገቡ።'] },
	phoneNo: { type: String, required: [true, 'እባክዎ ስልክ ቍጥርዎን ያስገቡ።'] },
	isOwn: { type: Boolean, required: true },
	ownerName: {
		type: String,
		// required: function () {
		// 	return [!this.isOwn, 'እባክዎ የስልኩን ባለቤት ስም ያስገቡ።'];
		// },
		validate: {
			validator: function () {
				// Only validate if isOwn is false
				if (!this.isOwn) {
					return false;
				}
				return true;
			},
			message: 'እባክዎ የስልኩን ባለቤት ስም ያስገቡ።',
		},
	},
	priesthood: { type: String, default: 'ምእመን' },
	isNewStudent: { type: Boolean, default: false },
	registryDate: {
		year: { type: Number, required: true },
		month: { type: String, required: true },
		date: { type: Number, required: true },
	},
	classDetails: {
		classroom: {
			type: String,
			required: function () {
				return [!this.isNewStudent, 'እባክዎ የትምህርት ክፍልዎን ያስገቡ።'];
			},
		},
		subject: {
			type: String,
			required: function () {
				return [!this.isNewStudent, 'እባክዎ የትምህርት ዐይነት ያስገቡ።'];
			},
		},
		classTime: {
			type: String,
			required: function () {
				return [!this.isNewStudent, 'እባክዎ የትምህርት ሰዓት ያስገቡ።'];
			},
			default: 'የጠዋት',
		},
	},
	confirmStatus: { type: String, default: 'registered' },
	progress: { type: String },
	paymentId: { type: String, required: [true, 'እባክዎ የደረሰኝ ቍጥርዎን ያስገቡ።'] },
	uniqueId: { type: String },
});

registrantSchema.pre('save', function (next) {
	if (this.isOwn) {
		this.ownerName = this.fullName;
	}
	if (this.isNewStudent) {
		this.classDetails.classTime = 'የጠዋት';
	}
	next();
});

export const Registrant =
	models.Registrant || model('Registrant', registrantSchema);
