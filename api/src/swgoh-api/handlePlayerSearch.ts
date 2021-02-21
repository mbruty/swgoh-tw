const handlePlayerSearch = async (swapi, allycode: string) => {
  allycode = allycode.replace(/\-/g, "");
  console.log(allycode);
  return await swapi.fetchPlayer({
    allycode: parseInt(allycode),
    project: { name: true, level: true, guildName: true, guildRefId: true },
  });
};

export default handlePlayerSearch;
