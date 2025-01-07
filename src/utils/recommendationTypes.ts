export interface Attraction {
	name: string;
	description: string;
	time: string;
}

export interface DayItinerary {
	date: string;
	attractions: Attraction[];
}

export interface Tag {
	name: string;
	weight: number;
}

export interface Recommendation {
	id: number;
	imgUrl?: string;
	name: string;
	length: number;
	confidence: number;
	location?: string;
	tags: Tag[];
	days?: DayItinerary[];
	match?: number;
	accommodationOffers?: Accommodation[];
	bookedAccommodation?: Accommodation;
}

export interface Accommodation {
	id?: number;
	name: string;
	description: string;
	pricePerNight: number;
	currency: string;
	location: string;
	tags: string[];
}

export interface LikedTrips {
	liked: number[];
	disliked: number[];
}