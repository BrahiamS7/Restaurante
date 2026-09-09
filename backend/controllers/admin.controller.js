import prisma from "../utils/prisma.js";
import bcrypt from "bcrypt";

// export function validarPass(password) {
//   if (password.length >= 8 && /\d/.test(password)) {
//     return {
//       msg: "Contraseña cumple con la medida de seguridad",
//       esValida: true,
//     };
//   }
//   return {
//     msg: "Contraseña no cumple con la medida de seguridad",
//     esValida: false,
//   };
// }

// ADMIN
export async function login(req, res) {
  try {
    const { usuario, password } = req.body;
    const user = await prisma.administrador.findUnique({
      where: { usuario },
    });
    if (!user) {
      return res
        .status(401)
        .json({ error: "Contraseña y/o usuario incorrectos" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res
        .status(401)
        .json({ error: "Contraseña y/o usuario incorrectos" });
    }
    res.status(200).json({ msg: "Usuario aprobado!" });
  } catch (error) {
    res.status(500).json({ msg: error.message, error });
  }
}

// MESEROS
export async function crearMesero(req, res) {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ msg: "Nombre sin enviar!" });
    }
    if (typeof nombre === "string" && nombre.trim().length > 0) {
      const mesero = await prisma.mesero.create({
        data: {
          nombre,
        },
      });
      return res.status(201).json(mesero);
    }
    return res.status(400).json({ msg: "Formato del nombre invalido!" });
  } catch (error) {
    res.status(500).json({ msg: error.message, error });
  }
}

export async function obtenerMeseros(req, res) {
  try {
    const meseros = await prisma.mesero.findMany({
      where: {
        activo: true,
      },
    });
    if (meseros.length === 0) {
      return res.status(400).json({ msg: "No hay meseros que mostrar" });
    }
    return res.status(200).json(meseros);
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}

export async function obtenerMeseroPorId(req, res) {
  try {
    const mesero_id = Number(req.params.id);
    if (
      typeof mesero_id !== "number" ||
      !Number.isInteger(mesero_id) ||
      mesero_id <= 0
    ) {
      return res.status(400).json({ msg: "Codigo de mesero invalido!" });
    }
    const mesero = await prisma.mesero.findUnique({
      where: {
        id: mesero_id,
      },
    });
    if (!mesero) {
      return res.status(400).json({ msg: "Mesero no encontrado!" });
    }

    return res
      .status(200)
      .json({ msg: "Mesero obtenido correctamente", mesero });
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}

export async function actualizarMesero(req, res) {
  try {
    const mesero_id = Number(req.params.id);
    const { nombre } = req.body;
    if (typeof nombre !== "string" || nombre.trim().length === 0) {
      return res.status(400).json({ msg: "Formato de nombre invalido!" });
    }
    if (
      typeof mesero_id !== "number" ||
      !Number.isInteger(mesero_id) ||
      mesero_id <= 0
    ) {
      return res.status(400).json({ msg: "Codigo de mesero invalido!" });
    }
    const meseroActualizado = await prisma.mesero.update({
      where: {
        id: mesero_id,
      },
      data: {
        nombre,
      },
    });
    return res
      .status(202)
      .json({ msg: "Mesero actualizado correctamente!", meseroActualizado });
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}

export async function desactivarMesero(req, res) {
  try {
    const mesero_id = Number(req.params.id);
    if (
      typeof mesero_id !== "number" ||
      !Number.isInteger(mesero_id) ||
      mesero_id <= 0
    ) {
      return res.status(400).json({ msg: "Codigo de mesero invalido!" });
    }
    const meseroDesactivado = await prisma.mesero.update({
      where: {
        id: mesero_id,
      },
      data: {
        activo: false,
      },
    });
    return res
      .status(200)
      .json({ msg: "Mesero desactivado correctamente!",meseroDesactivado});
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}
