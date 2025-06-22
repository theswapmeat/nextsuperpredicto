export interface UserTournamentRef {
  tournamentId: string; // or ObjectId if unconverted
  isPaid?: boolean;
  paymentDate?: string;
}

export interface UserType {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  tournaments: UserTournamentRef[];
}