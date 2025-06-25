export interface Show {
    showId: number;
    showName: string;
    venueId: number;
    venueName: string;
    showTypeId: number;
    showType: string;
    description: string;
    ageRestrictionId: number;
    ageRestrictionCode: string;
    warningDescription: string;
    startDate: string;
    endDate: string;
    ticketTypeId: number | null;
    ticketTypeName: string;
    imagesUrl: string;
    videosUrl: string;
    active: boolean;
}

export interface AgeRestrictionDto {
    ageRestrictionId: number;
    code: string;
    description: string;
}

export interface ShowTypeLookupDto {
    typeId: number;
    showType: string;
}