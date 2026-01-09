**Continuando con la actualización de los articulos del sistio `https://daniel-zamo.github.io` enfocate en los archivos siguientes,** estos son:

- **Archivo `src/content/docs/es/index.mdx`**

  ```mdx
  ---
  title: SysAdmin & DevOps
  description: Portfolio de automatización de infraestructura y administración de sistemas por Daniel Zamo.
  template: splash
  hero:
    tagline: Automatización de Infraestructura, Administración Linux Enterprise y Arquitectura Cloud.
    image:
      file: ../../../assets/images/hero-image.png
    actions:
      - text: Ver Proyecto Destacado (LAMP)
        link: /es/projects/middleware/lamp-ansible-docker/
        icon: rocket
        variant: primary
      - text: Procedimientos Operativos
        link: /es/linux-ops/
        icon: right-arrow
        variant: minimal
  prev: false
  next: false
  editUrl: false
  lastUpdated: 2025-12-06
  head:
    - tag: meta
      attrs:
        property: og:title
        content: "Daniel Zamo | SysAdmin & DevOps"
    - tag: meta
      attrs:
        property: og:description
        content: "Soluciones de Infraestructura como Código (Ansible), Docker y Administración Linux Enterprise."
    - tag: meta
      attrs:
        property: og:image
        content: https://daniel-zamo.github.io/images/og-homepage-es-es.png
    - tag: meta
      attrs:
        property: og:image:width
        content: "1200"
    - tag: meta
      attrs:
        property: og:image:height
        content: "630"
  ---
  
  import { Card, CardGrid } from '@astrojs/starlight/components';
  
  ## Implementaciones y Competencias
  
  <CardGrid stagger>
  
    <Card title="Automatización & AI-Ops" icon="rocket">
      Orquestación de infraestructura e integración de IA. Proyecto destacado: **Procesador Experto AZ-104** con n8n y Gemini para auditoría técnica.
      
      **[Ver Pipeline de IA →](/es/projects/automation/az104-ai-processor/)**
    </Card>
  
  
    <Card title="Automatización & IaC" icon="rocket">
      Despliegue de infraestructura inmutable. Ejemplo destacado: **Stack LAMP** con gestión de secretos, construcción de imágenes Docker custom y Makefiles.
      
      **[Ver Caso de Estudio: LAMP + Ansible →](/es/projects/middleware/lamp-ansible-docker/)**
    </Card>
  
    <Card title="Operaciones Cloud Azure" icon="microsoft">
      Diseño de soluciones IaaS/PaaS y gobierno de identidad. Alineado con el estándar **AZ-104**.
      
      **[Explorar Arquitecturas Cloud →](/es/cloud-ops/)**
    </Card>
    
    <Card title="Operaciones Linux Enterprise" icon="linux">
      Estándares operativos (SOP) para entornos de misión crítica: LVM, Hardening y Troubleshooting.
      
      **[Consultar Librería SOP →](/es/linux-ops/)**
    </Card>
    
    <Card title="Orquestación KVM/Libvirt" icon="laptop">
      Gestión de bajo nivel de recursos de cómputo. Aprovisionamiento de máquinas virtuales (VMs) mediante CLI y optimización de rendimiento.
      
      **[Ver Escenario de Virtualización →](/es/linux-ops/scenarios/04-kvm-management/)**
    </Card>
  
  
  </CardGrid>
  
  ```

- **Archivo `src/content/docs/en/index.mdx`**
  
  ```mdx
  ---
  title: SysAdmin & DevOps
  description: Infrastructure automation portfolio and architectural documentation by Daniel Zamo.
  template: splash
  hero:
    tagline: Infrastructure Orchestration, Enterprise Linux Administration, and Cloud Architecture.
    image:
      file: ../../../assets/images/hero-image.png
    actions:
      - text: View Featured Project (LAMP)
        link: /en/projects/middleware/lamp-ansible-docker/
        icon: rocket
        variant: primary
      - text: Browse Standard Procedures
        link: /en/linux-ops/
        icon: right-arrow
        variant: minimal
  prev: false
  next: false
  editUrl: false
  lastUpdated: 2025-12-06
  head:
    - tag: meta
      attrs:
        property: og:title
        content: "Daniel Zamo | SysAdmin & DevOps"
    - tag: meta
      attrs:
        property: og:description
        content: "Infrastructure as Code (Ansible), Docker solutions, and Enterprise Linux Administration."
    - tag: meta
      attrs:
        property: og:image
        content: https://daniel-zamo.github.io/images/og-homepage-en-us.png
    - tag: meta
      attrs:
        property: og:image:width
        content: "1200"
    - tag: meta
      attrs:
        property: og:image:height
        content: "630"
  ---
  
  import { Card, CardGrid } from '@astrojs/starlight/components';
  
  ## Implementations & Core Competencies
  
  
  
  <CardGrid stagger>
  
    <Card title="Automation & IaC" icon="rocket">
  
      Immutable infrastructure deployment. Featured case: **LAMP Stack** orchestration with secret management, custom Docker builds, and Makefiles.
  
      
  
      **[View Case Study: LAMP + Ansible →](/en/projects/middleware/lamp-ansible-docker/)**
  
    </Card>
  
  
  
    <Card title="Azure Cloud Architecture" icon="microsoft">
  
      Hybrid solution design and identity governance. Aligned with **AZ-104** (Azure Administrator) standards.
  
      
  
      **[Explore Cloud Operations →](/en/cloud-ops/)**
  
    </Card>
  
    
  
    <Card title="Enterprise Linux Operations" icon="linux">
  
      Technical knowledge base for mission-critical environments: LVM Storage Management, Security Hardening, and Troubleshooting.
  
      
  
      **[View Standard Procedures (SOP) →](/en/linux-ops/)**
  
    </Card>
  
    
  
    <Card title="KVM/Libvirt Orchestration" icon="laptop">
  
      Low-level compute resource management. CLI-based Virtual Machine (VM) provisioning and performance optimization.
  
      
  
      **[View Virtualization Scenario →](/en/linux-ops/scenarios/04-kvm-management/)**
  
    </Card>
  
  
  
    <Card title="Azure Cloud Architecture" icon="microsoft">
  
      Hybrid solution design and identity governance. Aligned with **AZ-104** (Azure Administrator) standards.
  
      
  
      *(Status: Active Certification Roadmap)*
  
    </Card>
  
  </CardGrid>
  ```

- **Archivo `src/content/docs/es/projects/index.mdx`**
  ```mdx
  ---
  title: Portafolio de Ingeniería
  description: Iniciativas de automatización de infraestructura, prácticas DevOps y arquitecturas Cloud-Native.
  sidebar:
    label: Visión General
    order: 0
  type: project
  ---
  
  import { Card, CardGrid, LinkButton } from '@astrojs/starlight/components';
  Esta sección consolida **proyectos de ingeniería de nivel producción** que demuestran capacidad técnica en la resolución de problemas complejos de infraestructura y optimización operativa.
  Cada entrada documenta no solo la implementación, sino la justificación de las **decisiones de arquitectura** y la reducción de **Toil** (carga operativa manual).
  ---
  
  ## 🎯 Dominios de Especialización
  
  <CardGrid>
    <Card title="Automatización & AI-Ops" icon="rocket">
      Orquestación de flujos inteligentes e integración de Modelos de Lenguaje (LLMs). Proyecto destacado: **Procesador experto AZ-104** con n8n y Gemini.
      **[Ver Soluciones de Automatización →](/es/projects/automation/)**
    </Card>
  
    <Card title="Ingeniería Middleware" icon="puzzle">
      Modernización de plataformas legacy mediante IaC. Despliegue inmutable de stacks LAMP y WildFly con Ansible y Docker.
  
      **[Ver Proyectos Middleware →](/es/projects/middleware/)**
    </Card>
  
    <Card title="Arquitectura Cloud Azure" icon="microsoft">
      **Roadmap Activo:** Diseño de Landing Zones y redes híbridas. Implementaciones de referencia alineadas con el estándar **AZ-104**.
  
      **[Explorar Operaciones Cloud →](/es/cloud-ops/)**
    </Card>
  
    <Card title="Cómputo & Virtualización" icon="laptop">
      **Roadmap Activo:** Gestión de bajo nivel de recursos mediante KVM/Libvirt y aprovisionamiento desatendido con Cloud-Init.
  
      **[Ver Escenarios de Virtualización →](/es/linux-ops/scenarios/04-kvm-management/)**
    </Card>
  </CardGrid>
  
  ---
  
  
  
  ## 📊 Habilidades Transversales
  
  
  
  - **Infrastructure as Code (IaC):** Gestión declarativa para asegurar la consistencia del entorno.
  
  - **AI-Ops:** Integración de IA Generativa para auditoría técnica y gestión del conocimiento.
  
  - **Inmutabilidad:** Uso de contenedores para eliminar la deriva de configuración.
  
  - **Excelencia Operacional:** Documentación estandarizada bajo marcos SOP.
  
  
  
  ---
  
  
  
  ## 🚀 Navegación Rápida
  
  
  
  <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1.5rem;">
  
    <LinkButton href="/es/projects/automation/" variant="primary" icon="rocket">
  
      Automatización e IA
  
    </LinkButton>
  
    <LinkButton href="/es/projects/middleware/" variant="secondary" icon="right-arrow">
  
      Soluciones Middleware
  
    </LinkButton>
  
  </div>
  
  
  
  :::tip[Enfoque Profesional]
  
  Los proyectos aquí presentados priorizan la **seguridad**, la **mantenibilidad** y el **desacoplamiento**, siguiendo estándares de arquitecturas distribuidas modernas.
  
  :::
  
  ```

- **Archivo `src/content/docs/en/projects/index.mdx`**
  ```mdx
  ---
  title: Engineering Portfolio
  description: Infrastructure automation initiatives, DevOps practices, and Cloud-Native architectures.
  sidebar:
    label: Overview
    order: 0
  type: project
  ---
  
  
  
  import { Card, CardGrid, LinkButton } from '@astrojs/starlight/components';
  
  
  
  This section consolidates **production-grade engineering projects** demonstrating technical expertise in solving complex infrastructure challenges and operational optimization.
  
  
  
  Each entry documents not only the implementation but also the **architectural decisions** and the reduction of **Toil** (manual operational load).
  
  
  
  ---
  
  
  
  ## 🎯 Specialization Domains
  
  
  
  <CardGrid>
  
    <Card title="Automation & AI-Ops" icon="rocket">
  
      Intelligent workflow orchestration and LLM integration. Featured: **AZ-104 expert processor** using n8n and Gemini 1.5 Flash.
  
      
  
      **[View Automation Solutions →](/en/projects/automation/)**
  
    </Card>
  
  
  
    <Card title="Middleware Engineering" icon="puzzle">
  
      Modernization of legacy platforms via IaC. Immutable deployment of LAMP and WildFly stacks using Ansible and Docker.
  
      
  
      **[View Middleware Projects →](/en/projects/middleware/)**
  
    </Card>
  
    
  
    <Card title="Azure Cloud Architecture" icon="microsoft">
  
      **Active Roadmap:** Landing Zone design and hybrid networking. Reference implementations aligned with **AZ-104** standards.
  
      
  
      **[Explore Cloud Operations →](/en/cloud-ops/)**
  
    </Card>
  
    
  
    <Card title="Compute & Virtualization" icon="laptop">
  
      **Active Roadmap:** Low-level resource management via KVM/Libvirt and unattended provisioning with Cloud-Init.
  
      
  
      **[View Virtualization Scenarios →](/en/linux-ops/scenarios/04-kvm-management/)**
  
    </Card>
  
  </CardGrid>
  
  
  
  ---
  
  
  
  ## 📊 Transversal Skills
  
  
  
  - **Infrastructure as Code (IaC):** Declarative management ensuring environment consistency.
  
  - **AI-Ops:** Integrating Generative AI for technical auditing and knowledge management.
  
  - **Immutability:** Leveraging containerization to eliminate configuration drift.
  
  - **Operational Excellence:** Standardized documentation under SOP frameworks.
  
  
  
  ---
  
  
  
  ## 🚀 Quick Navigation
  
  
  
  <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1.5rem;">
  
    <LinkButton href="/en/projects/automation/" variant="primary" icon="rocket">
  
      Automation & AI
  
    </LinkButton>
  
    <LinkButton href="/en/projects/middleware/" variant="secondary" icon="right-arrow">
  
      Middleware Solutions
  
    </LinkButton>
  
  </div>
  
  :::tip[Professional Focus]
  The projects presented here prioritize **security**, **maintainability**, and **decoupling**, following modern distributed architecture standards.
  :::
  
  ```

- **Archivo `src/content/docs/es/projects/automation/index.mdx`**
  ```mdx
  ---
  title: Ingeniería de Automatización y AI-Ops
  description: Implementación de flujos de orquestación, integración de IA y optimización de procesos operativos.
  sidebar:
    label: Automatización e IA
    order: 0
  type: project
  ---
  
  import { CardGrid, LinkCard } from '@astrojs/starlight/components';
  
  ## Visión de Ingeniería
  
  Esta sección documenta la transición hacia **Operaciones Autónomas**. El enfoque no es solo automatizar tareas, sino construir sistemas de auto-corrección y gestión de conocimiento mediante el uso de **Modelos de Lenguaje (LLMs)** y orquestadores asíncronos.
  
  ### Pilares de la Estrategia
  
  *   **Eliminación de Toil:** Reducción sistemática de tareas manuales repetitivas.
  *   **Inteligencia de Plataforma:** Integración de IA para auditoría técnica y toma de decisiones.
  *   **Escalabilidad:** Flujos diseñados para ser agnósticos a la infraestructura y altamente portátiles.
  
  ---
  
  ## 🚀 Proyectos Destacados
  
  <CardGrid>
    <LinkCard
      title="AI-Ops: Procesador AZ-104"
      description="Pipeline multimodal para la gestión y análisis experto de escenarios de Azure mediante Gemini 1.5 Flash."
      href="/es/projects/automation/az104-ai-processor/"
    />
  
  </CardGrid>
  
  ---
  
  ## 🛠️ Stack de Automatización
  
  | Herramienta | Aplicación | Valor de Negocio |
  |:-----------|:--------|:----------------------|
  | **n8n** | Orquestación | Desacoplamiento de procesos y gestión visual de workflows. |
  | **Gemini / OpenAI** | Razonamiento | Auditoría técnica automatizada y estructuración de datos. |
  | **Git / IaC** | Control | Versionado estricto de la lógica de automatización. |
  ```

- **Archivo `src/content/docs/en/projects/automation/index.mdx`**
  Archivo sin crear (falta)

**Tareas: se te solicita**

- **Compara y/o sincroniza (iguala) el contenido del archivo `src/content/docs/es/index.mdx` y el correspondiente simil en ingles `src/content/docs/en/index.mdx`**, para que queden correctamente sincronizados (en su correspondiente idioma) en caso de mayores discrepancias el prioritario es el que esta en `es`.

- **Compara y/o sincroniza (iguala) el contenido del archivo `src/content/docs/es/projects/index.mdx` y el correspondiente simil en ingles `src/content/docs/en/projects/index.mdx`**, para que queden correctamente sincronizados (en su correspondiente idioma) en caso de mayores discrepancias el prioritario es el que esta en `es`.

- **A partir del `src/content/docs/es/projects/automation/index.mdx` genera el `src/content/docs/en/projects/automation/index.mdx` que esta por el momento como faltante.