export interface Venue {
    imagesUrl: string;
    venueId: number;
    venueName: string;
    typeId: number;
    maxCapacity: number;
    description: string;
    contactEmail: string;
    contactPhone: string;
    active: boolean;
    venueUrl: string;
    locationId: number;
    locationName: string;
    rows?: number;
    seatsPerRow?: number;
}



export interface CreateVenueDto {
    /** @nullable */
    venueName?: string | null;
    typeId?: number;
    maxCapacity?: number;
    /** @nullable */
    description?: string | null;
    /** @nullable */
    contactEmail?: string | null;
    /** @nullable */
    contactPhone?: string | null;
    /** @nullable */
    imagesUrl?: string | null;
    active?: boolean;
    /** @nullable */
    venueUrl?: string | null;
    locationId?: number;
    rows?: number;
    seatsPerRow?: number;
}
export interface CreateLocationDto {
    LocationName: string;
    id: string;
    Address: string;
    Suburb: string;
    PostalCode: string;
    State: string;
    Country: string;
    Latitude: number;
    Longitude: number;
    ParkingAvailable: boolean;
    LocationId: number | null;
    Active: boolean;
}
export interface CreateLocationDtoGet {
    locationName: string;
    id: string;
    address: string;
    suburb: string;
    postalCode: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
    parkingAvailable: boolean;
    locationId: number | null;
}

export interface VenueType {
    typeId: number;
    venueType: string;
}