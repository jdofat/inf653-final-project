const State = require('../models/State');
const statesData = require('../data/statesData.json');

//

const getStateData = (code) => {
  return statesData.find(
    (state) => state.code.toUpperCase() === code.toUpperCase()
  );
};

//

const getAllStates = async (req, res) => {
  const contig = req.query.contig;
  let filteredStates = statesData;

  if (contig === 'true') {
    filteredStates = statesData.filter(
      (state) => state.code !== 'AK' && state.code !== 'HI'
    );
  } else if (contig === 'false') {
    filteredStates = statesData.filter(
      (state) => state.code === 'AK' || state.code === 'HI'
    );
  }

  const mongoStates = await State.find();
  const statesWithFacts = filteredStates.map((state) => {
    const mongoMatch = mongoStates.find((m) => m.stateCode === state.code);
    if (mongoMatch && mongoMatch.funfacts.length > 0) {
      return { ...state, funfacts: mongoMatch.funfacts };
    }
    return state;
  });

  res.json(statesWithFacts);
};

//

const getState = async (req, res) => {
  const code = req.params.state.toUpperCase();
  const state = getStateData(code);

  if (!state) {
    return res.status(404).json({ error: 'Invalid' });
  }

  const mongoState = await State.findOne({ stateCode: code });
  if (mongoState && mongoState.funfacts.length > 0) {
    state.funfacts = mongoState.funfacts;
  }

  res.json(state);
};

//

const getCapital = (req, res) => {
  const code = req.params.state.toUpperCase();
  const state = getStateData(code);

  if (!state) {
    return res.status(404).json({ error: 'Invalid' });
  }

  res.json({ state: state.state, capital: state.capital_city });
};


//

const getNickname = (req, res) => {
  const code = req.params.state.toUpperCase();
  const state = getStateData(code);

  if (!state) {
    return res.status(404).json({ error: 'Invalid' });
  }

  res.json({ state: state.state, nickname: state.nickname });
};

//

const getPopulation = (req, res) => {
  const code = req.params.state.toUpperCase();
  const state = getStateData(code);

  if (!state) {
    return res.status(404).json({ error: 'Invalid' });
  }

  res.json({ state: state.state, population: state.population.toLocaleString() });
};

//


const createFunFact = async (req, res) => {
  const code = req.params.state.toUpperCase();
  const { funfacts } = req.body;

  if (!funfacts || !Array.isArray(funfacts)) {
    return res.status(400).json({ error: 'error' });
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

//

const updateFunFact = async (req, res) => {
  const code = req.params.state.toUpperCase();
  const { index, funfact } = req.body;

  if (index === undefined || !funfact) {
    return res.status(400).json({ error: 'error' });
  }

  const stateDoc = await State.findOne({ stateCode: code });
  if (!stateDoc || !stateDoc.funfacts || index < 1 || index > stateDoc.funfacts.length) {
    return res.status(404).json({ error: 'error' });
  }

  stateDoc.funfacts[index - 1] = funfact;
  await stateDoc.save();

  res.json(stateDoc);
};

//

const deleteFunFact = async (req, res) => {
  const code = req.params.state.toUpperCase();
  const { index } = req.body;

  const stateDoc = await State.findOne({ stateCode: code });
  if (!stateDoc || !stateDoc.funfacts || index < 1 || index > stateDoc.funfacts.length) {
    return res.status(404).json({ error: 'error' });
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
  createFunFact,
  updateFunFact,
  deleteFunFact,
};
