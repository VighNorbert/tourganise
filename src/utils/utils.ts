import {LikedTrips} from "./recommendationTypes";

function getLikedTrips() {
	let likedTrips: LikedTrips = {liked: [], disliked: []};
	if (localStorage.getItem('likedTrips')) {
		likedTrips = JSON.parse(localStorage.getItem('likedTrips')!);
	}
	return likedTrips;

}

function removeTripFromLS(key: 'liked' | 'disliked', tripId: number) {
	const likedTrips = getLikedTrips();
	likedTrips[key] = likedTrips[key].filter((tId: number) => tId !== tripId);
	localStorage.setItem('likedTrips', JSON.stringify(likedTrips));
}

function addTripToLS(key: 'liked' | 'disliked', tripId: number) {
	const likedTrips = getLikedTrips();
	likedTrips[key].push(tripId);
	localStorage.setItem('likedTrips', JSON.stringify(likedTrips));
}

function isTripInLS(key: 'liked' | 'disliked', tripId: number) {
	const likedTrips = getLikedTrips();
	if (key === 'liked') {
		return likedTrips.liked.includes(tripId);
	} else {
		return likedTrips.disliked.includes(tripId);
	}
}

export function toggleTripInArray(inLiked: boolean, tripId: number) {
	const key = inLiked ? 'liked' : 'disliked';
	if (isTripInLS(key, tripId)) {
		removeTripFromLS(key, tripId);
	}
	else {
		removeTripFromLS(inLiked ? 'disliked' : 'liked', tripId);
		addTripToLS(key, tripId);
	}
}

export function intensityToString(intensity: number) {
	switch (intensity) {
		case 0:
			return "Relaxed";
		case 1:
			return "Balanced";
		case 2:
			return "Fast-paced";
		default:
			return "";
	}
}