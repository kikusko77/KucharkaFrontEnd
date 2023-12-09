export const checkContainsStrings = (str1: string, str2: string): boolean => {
  return str1.toLocaleLowerCase().includes(str2.toLocaleLowerCase()) || str1.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase().includes(str2.toLocaleLowerCase());
}

export const stringsEqualNormalized = (str1: string, str2: string): boolean => {
  return str1.toLocaleLowerCase() === str2.toLocaleLowerCase() || str1.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase() === str2.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase();
}