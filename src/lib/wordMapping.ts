export function wordMapping(
  word: string,
  dictionary: Record<string, string | number>,
  splitter: string = ",",
  joiner?: string,
) {
  const stringList = word.split(splitter);
  const newWord: (string | number)[] = [];

  stringList.forEach((item) => {
    newWord.push(dictionary[item]);
  });

  if (joiner) {
    return newWord.join(joiner);
  }

  return newWord.join(" ");
}
