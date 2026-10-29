import { useEffect, useState } from "react";

export const COLLECTIONS = {
  personnes: { title: "Personnes", singular: "personne", root: "Personne", article: "une" },
  organisations: { title: "Organisations", singular: "organisation", root: "Organisation", article: "une" },
};

const PROPERTY_LABELS = {
  nomComplet: "Nom complet",
  identifiantPersonne: "Identifiant",
  etatService: "État du service",
  dateMiseEnService: "Mise en service",
  referenceExploitation: "Référence d'exploitation",
  anneeCreation: "Année de création",
  nomGestionnaire: "Nom du gestionnaire",
  telephoneContact: "Téléphone de contact",
  travaillePour: "Travaille pour",
  emploiePersonne: "Emploie",
  collaboreAvec: "Collabore avec",
  organiseTransport: "Organise le transport",
  consulteCompteur: "Consulte le compteur",
  signaleIncident: "Signale l'incident",
  gere: "Gère le réseau",
  intervientSur: "Intervient sur",
  maintientEquipement: "Maintient l'équipement",
  prendEnChargeIncident: "Prend en charge l'incident",
  participeAuTransport: "Participe au transport",
  estResponsableDe: "Responsable de",
  estResponsableIncidentDe: "Responsable d'incident de",
  occupeBatiment: "Occupe le bâtiment",
  entretientTransformateur: "Entretient le transformateur",
  piloteEquipement: "Pilote l'équipement",
  piloteStockage: "Pilote le stockage",
  recoitDonneesDe: "Reçoit les données de",
  recoitMesuresDe: "Reçoit les mesures de",
  superviseProduction: "Supervise la production",
  assureMaintenance: "Assure la maintenance de",
};

const WORDS = {
  electriques: "électriques",
  reseau: "réseau",
  reseaux: "réseaux",
  equipe: "équipe",
  operateur: "opérateur",
  eolien: "éolien",
  residentiel: "résidentiel",
  photovoltaique: "photovoltaïque",
  cables: "câbles",
  aeriennes: "aériennes",
};

export function propertyLabel(name) {
  return PROPERTY_LABELS[name] ?? humanize(name);
}

/** « TechnicienLignesElectriques » -> « Technicien lignes électriques » */
export function humanize(name = "") {
  const words = name
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => WORDS[word] ?? word);
  const text = words.join(" ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Majuscule initiale seulement : les noms propres gardent leur casse. */
export const capitalize = (text = "") => text.charAt(0).toUpperCase() + text.slice(1);

export function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function formatValue(value, datatype) {
  if (datatype === "dateTime") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
  }
  if (datatype === "boolean") return value === "true" ? "Oui" : "Non";
  return value;
}

/** Liste des classes d'une collection, avec leur profondeur dans la hiérarchie (pour indenter les menus). */
export function classTree(classes) {
  const byParent = {};
  classes.forEach((item) => (byParent[item.parent ?? ""] ??= []).push(item));
  const rows = [];
  const walk = (parent, depth) =>
    (byParent[parent] ?? []).forEach((item) => {
      rows.push({ ...item, depth });
      walk(item.name, depth + 1);
    });
  const roots = classes.filter((item) => !classes.some((other) => other.name === item.parent));
  roots.forEach((root) => {
    rows.push({ ...root, depth: 0 });
    walk(root.name, 1);
  });
  return rows;
}

export function useDebounced(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function downloadCsv(filename, columns, rows) {
  const escape = (cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`;
  const lines = [columns.map((c) => escape(c.title)).join(";")];
  rows.forEach((row) => lines.push(columns.map((c) => escape(c.value(row))).join(";")));
  const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

/** Colonnes de la table (et de l'export CSV) pour chaque collection. */
export const COLUMNS = {
  personnes: [
    { title: "Nom", value: (r) => r.name },
    { title: "Identifiant RDF", value: (r) => r.id },
    { title: "Classe", value: (r) => humanize(r.type) },
    { title: "N° personne", value: (r) => r.properties.identifiantPersonne?.join(", ") },
    { title: "Organisation", value: (r) => r.properties.travaillePour?.join(", ") },
  ],
  organisations: [
    { title: "Nom", value: (r) => r.name },
    { title: "Identifiant RDF", value: (r) => r.id },
    { title: "Classe", value: (r) => humanize(r.type) },
    { title: "Employés déclarés", value: (r) => r.properties.emploiePersonne?.length ?? 0 },
    { title: "Collaborations", value: (r) => r.properties.collaboreAvec?.length ?? 0 },
  ],
};
