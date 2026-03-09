import {
  BrainCircuit,
  Database,
  Workflow,
  Cog,
  GitBranch,
  GitCommit,
  GitGraph,
  GitMerge,
  Box,
  Server,
  Terminal,
  Edit,
  Cpu,     // IMPORTANTE: Añadido
  Network, // IMPORTANTE: Añadido
  ShieldCheck,
  Layers,
  FileSpreadsheet,
  Folder,
  Wand2,
  Users,
  UserCheck,
  Lock,
  UserPlus,
  ScrollText,
  Megaphone,
  Gem,
  Mail,
  ShoppingBag,
  Flag,
  Container
} from "lucide-react";

// Categorías Principales
export const featureCards = [
  {
    icon: Database,
    title: "Big Data Admin",
    color: "text-blue-500",
    content: "Administración de Cloudera Data Platform (CDP). Gobernanza de HDFS, tuning de servicios y operaciones de clúster.",
    href: "/data-engineering/cloudera-administration",
  },
  {
    icon: GitGraph,
    title: "Version Control Hub",
    color: "text-blue-500",
    content: "Estándares de Git, Branching Models y Semántica de Commits para flujos de trabajo profesionales.",
    href: "/engineering-standards/version-control/",
  },
  {
    icon: BrainCircuit,
    title: "AI Engineering",
    color: "text-blue-500",
    content: "Protocolos de Ingestión Semántica y refactorización mediante Modelos de Lenguaje (LLM).",
    href: "/engineering-standards/ai-protocols/document-ingestion-pipeline" 
  },
  {
    icon: Container,
    title: "Platform Engineering",
    color: "text-blue-500",
    content: "Orquestación con Kubernetes v1.35, Hardening de sistemas y automatización de infraestructura.",
    href: "/platform-engineering",
  },
  {
    icon: Terminal,
    title: "SysAdmin & Linux",
    color: "text-green-500",
    content: "Estándares de configuración de sistemas, gestión de runtimes (Node.js) y optimización de workstation.",
    href: "/sysadmin-linux",
  },
];

// Sección CKA: Entorno y Productividad
export const setupCards = [
  {
    icon: Cog,
    title: "Bootstrap del Entorno",
    color: "text-blue-500",
    content: "Configuración de terminal de alto rendimiento: aliases críticos y optimización de variables de entorno.",
    href: "/platform-engineering/certification-lab/cka-environment-bootstrap",
  },
  {
    icon: Cpu,
    title: "Productividad Operativa",
    color: "text-blue-500",
    content: "Maximización del throughput de comandos y gestión de latencia humana en entornos de certificación.",
    href: "/platform-engineering/certification-lab/cka-terminal-productivity",
  },
];

// NUEVA SECCIÓN: Lifecycle de Kubernetes
export const k8sLifecycleCards = [
  {
    icon: ShieldCheck,
    title: "Hardening de OS & Runtime",
    color: "text-blue-500",
    content: "Preparación de nodos Ubuntu 24.04: configuración de Kernel, módulos de red y optimización de containerd.",
    href: "/platform-engineering/certification-lab/k8s-os-runtime-prep",
  },
  {
    icon: Box,
    title: "Provisión de Binarios",
    color: "text-blue-500",
    content: "Despliegue de toolchain (kubeadm, kubelet, kubectl) con estrategias de version-pinning.",
    href: "/platform-engineering/certification-lab/k8s-binaries-install",
  },
  {
    icon: Network,
    title: "Orquestación CNI (Calico)",
    color: "text-blue-500",
    content: "Bootstrap del clúster e implementación del operador Tigera para políticas de red avanzadas.",
    href: "/platform-engineering/certification-lab/k8s-cluster-bootstrap-calico",
  },
];

export const deployOptions = [
  { icon: GitBranch, title: "Branching Models", href: "/engineering-standards/version-control/git-branching-model" },
  { icon: GitCommit, title: "Conventional Commits", href: "/engineering-standards/version-control/git-conventional-commits" },
  { icon: Workflow, title: "GitLab API Ops", href: "/engineering-standards/version-control/gitlab-api-pipeline-cleanup" },
  { icon: Terminal, title: "Dotfiles Management", href: "/sysadmin-linux/terminal-tools/dotfiles-management" },
  { icon: Edit, title: "Vim Sovereignty", href: "/sysadmin-linux/terminal-tools/vim-sovereignty" },
];

export const textLabels = {
  title: {
    prefix: "dz.log",
    highlight: "Knowledge Engineering Hub",
  },
  subtitle:
    "Documentación Técnica de Grado Industrial: Estándares de Configuración, Procedimientos Operativos (SOP) y Estrategias de Platform Engineering.",
  
  setupDanielZamo: {
    title: "Kubernetes: Foundation & Productivity",
    description: "Estándares de preparación para la certificación CKA y optimización de la terminal de administración.",
  },
  k8sLifecycle: {
    title: "Cluster Lifecycle Management",
    description: "Protocolos paso a paso para el despliegue de infraestructura de cómputo distribuido sobre Kubernetes v1.35.",
  },
  deployOn: {
    title: "Procedimientos Operativos Destacados (SOP)",
  },
};

export const sectionCards = {
  gettingStarted: {
    title: "Kubernetes Infrastructure Lab",
    description: "Acceso directo al framework de configuración de nodos y bootstrap de clústeres de prueba.",
    link: "/platform-engineering/certification-lab/k8s-os-runtime-prep",
  },
};
