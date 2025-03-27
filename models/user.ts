export interface User {
  uid: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  level: string;
  levelPreference: string[];
  birthdate: string | null;
  image: string | null;
  availability: string[];
}

// Sample user based on reference data
export const sampleUser: User = {
  uid: "j5VIPbh5CQfk9W6RKRvnoaMsO3x2",
  name: "Aharnish",
  email: "aharnishpithva@gmail.com",
  age: 22,
  gender: "Male",
  level: "Novice",
  levelPreference: ["Novice", "Pro"],
  birthdate: null,
  image: null,
  availability: ["Thursday", "Friday"]
};