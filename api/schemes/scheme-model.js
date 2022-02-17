const db = require('./../../data/db-config')

function find() { 
  return db('schemes as sc')
    .select('sc.*')
    .count('st.step_id as number_of_steps')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .groupBy('sc.scheme_id')
    .orderBy('sc.scheme_id', 'asc')
}
  // EXERCISE A
  /*
    1A- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`.
    What happens if we change from a LEFT join to an INNER join?

      SELECT
          sc.*,
          count(st.step_id) as number_of_steps
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      GROUP BY sc.scheme_id
      ORDER BY sc.scheme_id ASC;

    2A- When you have a grasp on the query go ahead and build it in Knex.
    Return from this function the resulting dataset.
  */

async function findById(scheme_id) {
  const scheme = await db('schemes as sc')
    .select('sc.scheme_name', 'st.*')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .where('sc.scheme_id', scheme_id)
    .orderBy('st.step_number', 'asc')

  if (scheme.length < 1) {
    return null
  } else {
    const formattedScheme = {
      scheme_id: parseInt(scheme_id),
      scheme_name: scheme[0].scheme_name,
      steps: [],
    }

    scheme.map((sc) => {
      sc.step_id ? formattedScheme.steps.push({
        step_id: sc.step_id,
        step_number: sc.step_number,
        instructions: sc.instructions
      })
      : null
    })

    return formattedScheme
  }
}

function findSteps(scheme_id) {
  return db('schemes as sc')
    .select('sc.scheme_name', 'st.step_id', 'st.step_number', 'st.instructions')
    .join('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .where('sc.scheme_id', scheme_id)
    .orderBy('st.step_number', 'asc')
}

async function add(scheme) { 
  const [id] = await db('schemes').insert(scheme)
  const newRecord = await findById(id)
  return newRecord
}

async function addStep(scheme_id, step) { 
  await db('steps').insert({ scheme_id, ...step })
  const steps = await findSteps(scheme_id)
  return steps
}

module.exports = { 
  add,
  addStep, 
  find, 
  findById, 
  findSteps
}
