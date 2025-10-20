import express from "express";
import cors from "cors";
import axios from "axios"

// Tipos

type Team = {
    id: number
    name: string
    city: string
    titles: number
}

let teams: Team[] = [

 { id: 1, name: "Lakers", city: "Los Angeles", titles: 17 },

 { id: 2, name: "Celtics", city: "Boston", titles: 17 },

];

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- Rutas ---

app.get("/", (req, res) => {
  res.send("✅ Te has conectado correctamente.");
});

app.get("/teams", (req, res) => {
  res.json(teams);
});

app.get("/teams/:id", (req, res) => {
  const { id } = req.params;
  const person = teams.find((team) => team.id === Number(id));

  return person
    ? res.json(person)
    : res.status(404).json({ error: "Equipo no encontrado" });
});

app.post("/teams", (req, res) => {

  try {

    const newTeam: Team = {
      id: Date.now(),
      ...req.body,
    };

    teams.push(newTeam);
    res.status(201).json(newTeam);
  } catch (err: any) {

    res.status(500).json({ error: "Error al crear el equipo", detail: err.message });
  }
});

app.delete("/teams/:id", (req, res) => {
  try {
    const { id } = req.params;
    const exists = teams.some((p) => p.id === Number(id));

    if (!exists)
      return res.status(404).json({ error: "Equipo no encontrado" });

    teams = teams.filter((p) => p.id !== Number(id));

    res.json({ message: "Equipo eliminado correctamente" });

  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al eliminar el equipo"});
  }
});

// --- Inicio del servidor ---

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));

const testApi = async (equipos:Team[]) => {
  
    const todoslosEquipos = await (await axios.get("http://localhost:3000/teams")).data;

    console.log(todoslosEquipos)

    const crearEquipo = await axios.post("http://localhost:3000/teams", { name: "Bulls", city: "Chicago", titles: 6 });

    
    const EquiposActualizados = await (await axios.get("http://localhost:3000/teams")).data;

    const equipo: Team = EquiposActualizados.find((equipo: Team) => equipo.name === "Bulls");
    const id = equipo.id

    console.log(EquiposActualizados)

    const eliminarEquipo = await axios.delete(`http://localhost:3000/teams/${id}`);

    const ListaFinal = await (await axios.get("http://localhost:3000/teams")).data;

    console.log(ListaFinal)

};

setTimeout(() => {
    testApi(teams)
}, 1000);



