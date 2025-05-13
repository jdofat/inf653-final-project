const State = require("../models/State");
const statesData = require("../data/statesData.json");


//

console.log("a");

const getStateData = (code) => {
  return statesData.find(
    (state) => state.code.toUpperCase() === code.toUpperCase()
  );
};

//

const getAllStates = async (req, res) => {
  try {
    const contig = req.query.contig;

    let result = [...statesData];

    if (contig === 'true') {
      result = result.filter(state => state.code !== 'AK' && state.code !== 'HI');
    } else if (contig === 'false') {
      result = result.filter(state => state.code === 'AK' || state.code === 'HI');
    }

    const mongoStates = await State.find();
    const funfactsMap = {};
    mongoStates.forEach(doc => {
      funfactsMap[doc.stateCode] = doc.funfacts;
    });

    result = result.map(state => {
      const funfacts = funfactsMap[state.code];
      if (funfacts && funfacts.length > 0) {
        return { ...state, funfacts };
      }
      return state;
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

//

const getState = async (req, res) => {
  const stateCode = req.params.state.toUpperCase();

  const stateData = statesData.find(state => state.code === stateCode);
  if (!stateData) {
    return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
  }

  const mongoState = await State.findOne({ stateCode }).exec();

  const result = { ...stateData };
  if (mongoState?.funfacts?.length > 0) {
    result.funfacts = mongoState.funfacts;
  }

  res.json(result);
};

/*

const getCapital = (req, res) => {
  const stateCode = req.params.state.toUpperCase();

  const stateData = statesData.find((state) => state.code === stateCode);
  if (!stateData) {
    return res
      .status(400)
      .json({ message: "Invalid state abbreviation parameter" });
  }

  res.json({ state: stateData.state, capital: stateData.capital });
};

*/
//

const getCapital = (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const state = statesData.find(st => st.code === stateCode);

  if (!state) {
    return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
  }

  return res.json({
    state: state.state,
    capital: state.capital_city
  });
};


//
const getNickname = (req, res) => {
  const stateCode = req.params.state.toUpperCase();

  const stateData = statesData.find((state) => state.code === stateCode);
  if (!stateData) {
    return res
      .status(400)
      .json({ message: "Invalid state abbreviation parameter" });
  }

  res.json({ state: stateData.state, nickname: stateData.nickname });
};

//

const getPopulation = (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const stateData = statesData.find(state => state.code === stateCode);

  if (!stateData) {
    return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
  }

  const population = stateData.population.toLocaleString('en-US');

  res.json({ state: stateData.state, population });
};

//

const getAdmissionDate = (req, res) => {
  const stateCode = req.params.state.toUpperCase();

  const state = statesData.find((st) => st.code === stateCode);
  if (!state) {
    return res
      .status(400)
      .json({ message: "Invalid state abbreviation parameter" });
  }

  res.json({
    state: state.state,
    admitted: state.admission_date,
  });
};

//

const getFunFact = async (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const stateData = statesData.find(state => state.code === stateCode);

  if (!stateData) {
    return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
  }

  try {
    const mongoState = await State.findOne({ stateCode }).exec();

    if (!mongoState || !mongoState.funfacts || mongoState.funfacts.length === 0) {
      return res.status(404).json({ message: `No Fun Facts found for ${stateData.state}` });
    }

    const randomFact = mongoState.funfacts[Math.floor(Math.random() * mongoState.funfacts.length)];

    res.json({ funfact: randomFact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/*

const createFunFact = async (req, res) => {
  const code = req.params.state.toUpperCase();
  const { funfacts } = req.body;

  if (!funfacts || !Array.isArray(funfacts)) {
    return res.status(400).json({ error: "error" });
  }

  let stateDoc = await State.findOne({ stateCode: code });
  if (!stateDoc) {
    stateDoc = await State.create({ stateCode: code, funfacts });
  } else {
    stateDoc.funfacts.push(...funfacts);
    await stateDoc.save();
  }

  res.json(stateDoc);
};


*/

//

const createFunFact = async (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const funfacts = req.body.funfacts;

  const stateExists = statesData.find((state) => state.code === stateCode);
  if (!stateExists) {
    return res
      .status(400)
      .json({ message: "Invalid state abbreviation parameter" });
  }

  if (!funfacts) {
    return res.status(400).json({ message: "State fun facts value required" });
  }

  if (!Array.isArray(funfacts)) {
    return res
      .status(400)
      .json({ message: "State fun facts value must be an array" });
  }

  let stateDoc = await State.findOne({ stateCode });

  if (!stateDoc) {
    stateDoc = await State.create({ stateCode, funfacts });
  } else {
    stateDoc.funfacts.push(...funfacts);
    await stateDoc.save();
  }

  res.json(stateDoc);
};

//

const updateFunFact = async (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const { index, funfact } = req.body;

  const statesData = require("../data/statesData.json");
  const validState = statesData.find((state) => state.code === stateCode);
  if (!validState) {
    return res
      .status(400)
      .json({ message: "Invalid state abbreviation parameter" });
  }

  if (index === undefined || funfact === undefined) {
    return res
      .status(400)
      .json({ message: "State fun fact index and value required" });
  }

  const stateDoc = await State.findOne({ stateCode }).exec();

  if (
    !stateDoc ||
    !Array.isArray(stateDoc.funfacts) ||
    stateDoc.funfacts.length === 0
  ) {
    return res
      .status(404)
      .json({ message: `No Fun Facts found for ${validState.state}` });
  }

  if (index < 1 || index > stateDoc.funfacts.length) {
    return res.status(400).json({
      message: `No Fun Fact found at that index for ${validState.state}`,
    });
  }

  stateDoc.funfacts[index - 1] = funfact;
  await stateDoc.save();

  res.json(stateDoc);
};

//

const deleteFunFact = async (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const { index } = req.body;

  const statesData = require("../data/statesData.json");
  const validState = statesData.find((state) => state.code === stateCode);
  if (!validState) {
    return res
      .status(400)
      .json({ message: "Invalid state abbreviation parameter" });
  }

  if (index === undefined) {
    return res.status(400).json({ message: "State fun fact index required" });
  }

  const stateDoc = await State.findOne({ stateCode }).exec();

  if (
    !stateDoc ||
    !Array.isArray(stateDoc.funfacts) ||
    stateDoc.funfacts.length === 0
  ) {
    return res
      .status(404)
      .json({ message: `No Fun Facts found for ${validState.state}` });
  }

  if (index < 1 || index > stateDoc.funfacts.length) {
    return res
      .status(400)
      .json({
        message: `No Fun Fact found at that index for ${validState.state}`,
      });
  }

  stateDoc.funfacts.splice(index - 1, 1);
  await stateDoc.save();

  res.json(stateDoc);
};

//exports

module.exports = {
  getAllStates,
  getState,
  getCapital,
  getNickname,
  getPopulation,
  getAdmissionDate,

  getFunFact,
  createFunFact,
  updateFunFact,
  deleteFunFact,
};
