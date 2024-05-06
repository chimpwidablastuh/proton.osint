export type Company = {
  name: string;
  link: string;
};

export type Person = {
  name: string;
  link: string;
  companies: Company[];
};
