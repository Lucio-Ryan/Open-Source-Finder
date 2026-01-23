import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

// Schemas
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
});

const ProprietarySoftwareSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  website: String,
});

const AlternativeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  short_description: String,
  long_description: String,
  website: String,
  github_url: String,
  license: String,
  is_featured: { type: Boolean, default: false },
  upvotes: { type: Number, default: 0 },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  alternative_to: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProprietarySoftware' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const ProprietarySoftware = mongoose.models.ProprietarySoftware || mongoose.model('ProprietarySoftware', ProprietarySoftwareSchema);
const Alternative = mongoose.models.Alternative || mongoose.model('Alternative', AlternativeSchema);

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 100 new alternatives that don't exist in the database
const newAlternatives = [
  // Code Quality & Linting
  { name: 'ESLint', description: 'Pluggable JavaScript linter', website: 'https://eslint.org', github: 'https://github.com/eslint/eslint', license: 'MIT', categories: ['Developer Tools', 'Code Review'], alternative_to: ['JSLint', 'JSHint'] },
  { name: 'Prettier', description: 'Opinionated code formatter', website: 'https://prettier.io', github: 'https://github.com/prettier/prettier', license: 'MIT', categories: ['Developer Tools'], alternative_to: ['Beautify'] },
  { name: 'Biome', description: 'Fast formatter and linter for JavaScript', website: 'https://biomejs.dev', github: 'https://github.com/biomejs/biome', license: 'MIT', categories: ['Developer Tools'], alternative_to: ['ESLint', 'Prettier'] },
  { name: 'Ruff', description: 'Extremely fast Python linter', website: 'https://docs.astral.sh/ruff', github: 'https://github.com/astral-sh/ruff', license: 'MIT', categories: ['Developer Tools'], alternative_to: ['Pylint', 'Flake8'] },
  { name: 'dprint', description: 'Pluggable code formatting platform', website: 'https://dprint.dev', github: 'https://github.com/dprint/dprint', license: 'MIT', categories: ['Developer Tools'], alternative_to: ['Prettier'] },

  // Build Tools & Package Managers
  { name: 'pnpm', description: 'Fast, disk space efficient package manager', website: 'https://pnpm.io', github: 'https://github.com/pnpm/pnpm', license: 'MIT', categories: ['Developer Tools'], alternative_to: ['npm', 'Yarn'] },
  { name: 'Bun', description: 'All-in-one JavaScript runtime & toolkit', website: 'https://bun.sh', github: 'https://github.com/oven-sh/bun', license: 'MIT', categories: ['Developer Tools'], alternative_to: ['Node.js', 'Deno'] },
  { name: 'Turborepo', description: 'High-performance build system for monorepos', website: 'https://turbo.build', github: 'https://github.com/vercel/turborepo', license: 'MIT', categories: ['Developer Tools', 'CI/CD'], alternative_to: ['Lerna', 'Nx'] },
  { name: 'Nx', description: 'Smart monorepo build system', website: 'https://nx.dev', github: 'https://github.com/nrwl/nx', license: 'MIT', categories: ['Developer Tools'], alternative_to: ['Lerna', 'Bazel'] },
  { name: 'esbuild', description: 'Extremely fast JavaScript bundler', website: 'https://esbuild.github.io', github: 'https://github.com/evanw/esbuild', license: 'MIT', categories: ['Developer Tools'], alternative_to: ['Webpack', 'Rollup'] },
  { name: 'Vite', description: 'Next generation frontend tooling', website: 'https://vitejs.dev', github: 'https://github.com/vitejs/vite', license: 'MIT', categories: ['Developer Tools'], alternative_to: ['Webpack', 'Parcel'] },
  { name: 'Rollup', description: 'JavaScript module bundler', website: 'https://rollupjs.org', github: 'https://github.com/rollup/rollup', license: 'MIT', categories: ['Developer Tools'], alternative_to: ['Webpack'] },
  { name: 'SWC', description: 'Rust-based JavaScript compiler', website: 'https://swc.rs', github: 'https://github.com/swc-project/swc', license: 'Apache-2.0', categories: ['Developer Tools'], alternative_to: ['Babel'] },
  { name: 'Rspack', description: 'Rust-based JavaScript bundler', website: 'https://rspack.dev', github: 'https://github.com/web-infra-dev/rspack', license: 'MIT', categories: ['Developer Tools'], alternative_to: ['Webpack'] },

  // Databases & Caching
  { name: 'ValKey', description: 'High-performance key-value store fork of Redis', website: 'https://valkey.io', github: 'https://github.com/valkey-io/valkey', license: 'BSD-3-Clause', categories: ['Database & Storage'], alternative_to: ['Redis'] },
  { name: 'SurrealDB', description: 'Multi-model database for modern applications', website: 'https://surrealdb.com', github: 'https://github.com/surrealdb/surrealdb', license: 'Apache-2.0', categories: ['Database & Storage'], alternative_to: ['MongoDB', 'PostgreSQL'] },
  { name: 'Garnet', description: 'High-performance cache-store from Microsoft', website: 'https://microsoft.github.io/garnet', github: 'https://github.com/microsoft/garnet', license: 'MIT', categories: ['Database & Storage'], alternative_to: ['Redis'] },
  { name: 'RisingWave', description: 'Distributed SQL streaming database', website: 'https://risingwave.com', github: 'https://github.com/risingwavelabs/risingwave', license: 'Apache-2.0', categories: ['Database & Storage', 'Data & Analytics'], alternative_to: ['Apache Flink', 'Materialize'] },
  { name: 'Pocketbase', description: 'Backend in a single file', website: 'https://pocketbase.io', github: 'https://github.com/pocketbase/pocketbase', license: 'MIT', categories: ['Database & Storage', 'Backend as a Service'], alternative_to: ['Firebase', 'Supabase'] },
  { name: 'EdgeDB', description: 'Graph-relational database', website: 'https://edgedb.com', github: 'https://github.com/edgedb/edgedb', license: 'Apache-2.0', categories: ['Database & Storage'], alternative_to: ['PostgreSQL', 'Neo4j'] },
  { name: 'Dolt', description: 'Git for data - version controlled SQL database', website: 'https://dolthub.com', github: 'https://github.com/dolthub/dolt', license: 'Apache-2.0', categories: ['Database & Storage'], alternative_to: ['MySQL', 'Git LFS'] },
  { name: 'CozoDB', description: 'Transactional relational-graph-vector database', website: 'https://cozodb.org', github: 'https://github.com/cozodb/cozo', license: 'MPL-2.0', categories: ['Database & Storage'], alternative_to: ['Neo4j', 'PostgreSQL'] },

  // AI & Machine Learning
  { name: 'vLLM', description: 'High-throughput LLM serving engine', website: 'https://vllm.ai', github: 'https://github.com/vllm-project/vllm', license: 'Apache-2.0', categories: ['AI & Machine Learning'], alternative_to: ['NVIDIA Triton', 'TensorRT-LLM'] },
  { name: 'llama.cpp', description: 'LLM inference in C/C++', website: 'https://github.com/ggerganov/llama.cpp', github: 'https://github.com/ggerganov/llama.cpp', license: 'MIT', categories: ['AI & Machine Learning'], alternative_to: ['PyTorch', 'TensorFlow'] },
  { name: 'Haystack', description: 'End-to-end NLP framework', website: 'https://haystack.deepset.ai', github: 'https://github.com/deepset-ai/haystack', license: 'Apache-2.0', categories: ['AI & Machine Learning'], alternative_to: ['LangChain', 'LlamaIndex'] },
  { name: 'MLflow', description: 'Platform for ML lifecycle', website: 'https://mlflow.org', github: 'https://github.com/mlflow/mlflow', license: 'Apache-2.0', categories: ['AI & Machine Learning'], alternative_to: ['Weights & Biases', 'Neptune.ai'] },
  { name: 'Kubeflow', description: 'ML toolkit for Kubernetes', website: 'https://kubeflow.org', github: 'https://github.com/kubeflow/kubeflow', license: 'Apache-2.0', categories: ['AI & Machine Learning', 'DevOps & Infrastructure'], alternative_to: ['SageMaker', 'Vertex AI'] },
  { name: 'Ray', description: 'Unified framework for scaling AI', website: 'https://ray.io', github: 'https://github.com/ray-project/ray', license: 'Apache-2.0', categories: ['AI & Machine Learning'], alternative_to: ['Spark', 'Dask'] },
  { name: 'Label Studio', description: 'Data labeling platform', website: 'https://labelstud.io', github: 'https://github.com/HumanSignal/label-studio', license: 'Apache-2.0', categories: ['AI & Machine Learning'], alternative_to: ['Labelbox', 'Scale AI'] },
  { name: 'Qdrant', description: 'Vector similarity search engine', website: 'https://qdrant.tech', github: 'https://github.com/qdrant/qdrant', license: 'Apache-2.0', categories: ['AI & Machine Learning', 'Database & Storage'], alternative_to: ['Pinecone', 'Weaviate'] },
  { name: 'LiteLLM', description: 'Call 100+ LLM APIs using OpenAI format', website: 'https://litellm.ai', github: 'https://github.com/BerriAI/litellm', license: 'MIT', categories: ['AI & Machine Learning'], alternative_to: ['OpenAI API', 'Anthropic API'] },
  { name: 'OpenLLMetry', description: 'Observability for LLM applications', website: 'https://traceloop.com/openllmetry', github: 'https://github.com/traceloop/openllmetry', license: 'Apache-2.0', categories: ['AI & Machine Learning', 'Monitoring & Observability'], alternative_to: ['LangSmith', 'Helicone'] },

  // Networking & Proxy
  { name: 'Envoy', description: 'Cloud-native high-performance proxy', website: 'https://envoyproxy.io', github: 'https://github.com/envoyproxy/envoy', license: 'Apache-2.0', categories: ['DevOps & Infrastructure', 'Networking'], alternative_to: ['NGINX', 'HAProxy'] },
  { name: 'Cilium', description: 'eBPF-based networking for Kubernetes', website: 'https://cilium.io', github: 'https://github.com/cilium/cilium', license: 'Apache-2.0', categories: ['DevOps & Infrastructure', 'Security & Privacy'], alternative_to: ['Calico', 'Flannel'] },
  { name: 'Istio', description: 'Service mesh for Kubernetes', website: 'https://istio.io', github: 'https://github.com/istio/istio', license: 'Apache-2.0', categories: ['DevOps & Infrastructure'], alternative_to: ['Linkerd', 'Consul Connect'] },
  { name: 'Teleport', description: 'Identity-native infrastructure access', website: 'https://goteleport.com', github: 'https://github.com/gravitational/teleport', license: 'Apache-2.0', categories: ['Security & Privacy', 'DevOps & Infrastructure'], alternative_to: ['BeyondTrust', 'CyberArk'] },
  { name: 'Boundary', description: 'Identity-based access management', website: 'https://boundaryproject.io', github: 'https://github.com/hashicorp/boundary', license: 'MPL-2.0', categories: ['Security & Privacy'], alternative_to: ['BeyondTrust', 'Teleport'] },

  // Container & Kubernetes
  { name: 'containerd', description: 'Industry-standard container runtime', website: 'https://containerd.io', github: 'https://github.com/containerd/containerd', license: 'Apache-2.0', categories: ['DevOps & Infrastructure', 'Containerization'], alternative_to: ['Docker Engine'] },
  { name: 'Buildah', description: 'Build OCI container images', website: 'https://buildah.io', github: 'https://github.com/containers/buildah', license: 'Apache-2.0', categories: ['DevOps & Infrastructure', 'Containerization'], alternative_to: ['Docker Build'] },
  { name: 'Skaffold', description: 'Continuous development for Kubernetes', website: 'https://skaffold.dev', github: 'https://github.com/GoogleContainerTools/skaffold', license: 'Apache-2.0', categories: ['DevOps & Infrastructure', 'Developer Tools'], alternative_to: ['Tilt', 'Garden'] },
  { name: 'Kustomize', description: 'Kubernetes native configuration management', website: 'https://kustomize.io', github: 'https://github.com/kubernetes-sigs/kustomize', license: 'Apache-2.0', categories: ['DevOps & Infrastructure'], alternative_to: ['Helm'] },
  { name: 'Helm', description: 'Kubernetes package manager', website: 'https://helm.sh', github: 'https://github.com/helm/helm', license: 'Apache-2.0', categories: ['DevOps & Infrastructure'], alternative_to: ['Kustomize'] },
  { name: 'Flux', description: 'GitOps for Kubernetes', website: 'https://fluxcd.io', github: 'https://github.com/fluxcd/flux2', license: 'Apache-2.0', categories: ['DevOps & Infrastructure', 'CI/CD'], alternative_to: ['ArgoCD', 'Jenkins X'] },
  { name: 'ArgoCD', description: 'Declarative GitOps CD for Kubernetes', website: 'https://argoproj.github.io/cd', github: 'https://github.com/argoproj/argo-cd', license: 'Apache-2.0', categories: ['DevOps & Infrastructure', 'CI/CD'], alternative_to: ['Flux', 'Spinnaker'] },
  { name: 'Tekton', description: 'Cloud-native CI/CD', website: 'https://tekton.dev', github: 'https://github.com/tektoncd/pipeline', license: 'Apache-2.0', categories: ['CI/CD', 'DevOps & Infrastructure'], alternative_to: ['Jenkins', 'GitHub Actions'] },

  // Monitoring & Logging
  { name: 'OpenTelemetry', description: 'Observability framework', website: 'https://opentelemetry.io', github: 'https://github.com/open-telemetry/opentelemetry-specification', license: 'Apache-2.0', categories: ['Monitoring & Observability'], alternative_to: ['Datadog', 'New Relic'] },
  { name: 'Fluent Bit', description: 'Fast log processor and forwarder', website: 'https://fluentbit.io', github: 'https://github.com/fluent/fluent-bit', license: 'Apache-2.0', categories: ['Monitoring & Observability'], alternative_to: ['Logstash', 'Fluentd'] },
  { name: 'Thanos', description: 'Highly available Prometheus setup', website: 'https://thanos.io', github: 'https://github.com/thanos-io/thanos', license: 'Apache-2.0', categories: ['Monitoring & Observability'], alternative_to: ['Cortex', 'Mimir'] },
  { name: 'Cortex', description: 'Horizontally scalable Prometheus', website: 'https://cortexmetrics.io', github: 'https://github.com/cortexproject/cortex', license: 'Apache-2.0', categories: ['Monitoring & Observability'], alternative_to: ['Thanos', 'Mimir'] },
  { name: 'Mimir', description: 'Scalable long-term storage for Prometheus', website: 'https://grafana.com/oss/mimir', github: 'https://github.com/grafana/mimir', license: 'AGPL-3.0', categories: ['Monitoring & Observability'], alternative_to: ['Thanos', 'Cortex'] },
  { name: 'Tempo', description: 'Distributed tracing backend', website: 'https://grafana.com/oss/tempo', github: 'https://github.com/grafana/tempo', license: 'AGPL-3.0', categories: ['Monitoring & Observability'], alternative_to: ['Jaeger', 'Zipkin'] },

  // Security Tools
  { name: 'Falco', description: 'Cloud-native runtime security', website: 'https://falco.org', github: 'https://github.com/falcosecurity/falco', license: 'Apache-2.0', categories: ['Security & Privacy', 'DevOps & Infrastructure'], alternative_to: ['Sysdig Secure', 'Aqua Security'] },
  { name: 'Kyverno', description: 'Kubernetes native policy management', website: 'https://kyverno.io', github: 'https://github.com/kyverno/kyverno', license: 'Apache-2.0', categories: ['Security & Privacy', 'DevOps & Infrastructure'], alternative_to: ['OPA Gatekeeper'] },
  { name: 'Cosign', description: 'Container signing and verification', website: 'https://sigstore.dev', github: 'https://github.com/sigstore/cosign', license: 'Apache-2.0', categories: ['Security & Privacy', 'DevOps & Infrastructure'], alternative_to: ['Docker Content Trust'] },
  { name: 'CrowdSec', description: 'Collaborative security engine', website: 'https://crowdsec.net', github: 'https://github.com/crowdsecurity/crowdsec', license: 'MIT', categories: ['Security & Privacy'], alternative_to: ['Fail2ban', 'Cloudflare WAF'] },
  { name: 'Checkov', description: 'Infrastructure as code security scanner', website: 'https://checkov.io', github: 'https://github.com/bridgecrewio/checkov', license: 'Apache-2.0', categories: ['Security & Privacy', 'DevOps & Infrastructure'], alternative_to: ['Snyk IaC', 'Terraform Sentinel'] },
  { name: 'SOPS', description: 'Secrets management for config files', website: 'https://getsops.io', github: 'https://github.com/getsops/sops', license: 'MPL-2.0', categories: ['Security & Privacy'], alternative_to: ['HashiCorp Vault', 'AWS Secrets Manager'] },

  // Web Frameworks & SSR
  { name: 'Astro', description: 'Web framework for content-driven websites', website: 'https://astro.build', github: 'https://github.com/withastro/astro', license: 'MIT', categories: ['Developer Tools', 'Web Development'], alternative_to: ['Next.js', 'Gatsby'] },
  { name: 'SvelteKit', description: 'Web development framework for Svelte', website: 'https://kit.svelte.dev', github: 'https://github.com/sveltejs/kit', license: 'MIT', categories: ['Developer Tools', 'Web Development'], alternative_to: ['Next.js', 'Nuxt'] },
  { name: 'Nuxt', description: 'Vue.js framework', website: 'https://nuxt.com', github: 'https://github.com/nuxt/nuxt', license: 'MIT', categories: ['Developer Tools', 'Web Development'], alternative_to: ['Next.js'] },
  { name: 'Remix', description: 'Full stack web framework', website: 'https://remix.run', github: 'https://github.com/remix-run/remix', license: 'MIT', categories: ['Developer Tools', 'Web Development'], alternative_to: ['Next.js'] },
  { name: 'Fresh', description: 'Next-gen web framework for Deno', website: 'https://fresh.deno.dev', github: 'https://github.com/denoland/fresh', license: 'MIT', categories: ['Developer Tools', 'Web Development'], alternative_to: ['Next.js'] },
  { name: 'Qwik', description: 'Instant-loading web framework', website: 'https://qwik.builder.io', github: 'https://github.com/QwikDev/qwik', license: 'MIT', categories: ['Developer Tools', 'Web Development'], alternative_to: ['React', 'Next.js'] },
  { name: 'SolidJS', description: 'Reactive JavaScript library', website: 'https://solidjs.com', github: 'https://github.com/solidjs/solid', license: 'MIT', categories: ['Developer Tools', 'Web Development'], alternative_to: ['React', 'Vue.js'] },
  { name: 'Preact', description: 'Fast 3kB alternative to React', website: 'https://preactjs.com', github: 'https://github.com/preactjs/preact', license: 'MIT', categories: ['Developer Tools', 'Web Development'], alternative_to: ['React'] },

  // Backend Frameworks
  { name: 'Hono', description: 'Fast web framework for the edge', website: 'https://hono.dev', github: 'https://github.com/honojs/hono', license: 'MIT', categories: ['Developer Tools', 'Backend Development'], alternative_to: ['Express.js', 'Fastify'] },
  { name: 'Fastify', description: 'Fast and low overhead web framework', website: 'https://fastify.dev', github: 'https://github.com/fastify/fastify', license: 'MIT', categories: ['Developer Tools', 'Backend Development'], alternative_to: ['Express.js'] },
  { name: 'Elysia', description: 'Ergonomic framework for Bun', website: 'https://elysiajs.com', github: 'https://github.com/elysiajs/elysia', license: 'MIT', categories: ['Developer Tools', 'Backend Development'], alternative_to: ['Express.js', 'Fastify'] },
  { name: 'Hapi', description: 'Rich framework for building applications', website: 'https://hapi.dev', github: 'https://github.com/hapijs/hapi', license: 'BSD-3-Clause', categories: ['Developer Tools', 'Backend Development'], alternative_to: ['Express.js'] },
  { name: 'Fiber', description: 'Express inspired web framework for Go', website: 'https://gofiber.io', github: 'https://github.com/gofiber/fiber', license: 'MIT', categories: ['Developer Tools', 'Backend Development'], alternative_to: ['Gin', 'Echo'] },
  { name: 'Gin', description: 'HTTP web framework for Go', website: 'https://gin-gonic.com', github: 'https://github.com/gin-gonic/gin', license: 'MIT', categories: ['Developer Tools', 'Backend Development'], alternative_to: ['Express.js'] },
  { name: 'Echo', description: 'High performance Go web framework', website: 'https://echo.labstack.com', github: 'https://github.com/labstack/echo', license: 'MIT', categories: ['Developer Tools', 'Backend Development'], alternative_to: ['Gin', 'Fiber'] },
  { name: 'Actix Web', description: 'Rust web framework', website: 'https://actix.rs', github: 'https://github.com/actix/actix-web', license: 'MIT', categories: ['Developer Tools', 'Backend Development'], alternative_to: ['Express.js', 'Rocket'] },
  { name: 'Axum', description: 'Ergonomic and modular Rust web framework', website: 'https://github.com/tokio-rs/axum', github: 'https://github.com/tokio-rs/axum', license: 'MIT', categories: ['Developer Tools', 'Backend Development'], alternative_to: ['Actix Web'] },

  // ORM & Database Tools
  { name: 'Prisma', description: 'Next-generation Node.js ORM', website: 'https://prisma.io', github: 'https://github.com/prisma/prisma', license: 'Apache-2.0', categories: ['Developer Tools', 'Database & Storage'], alternative_to: ['TypeORM', 'Sequelize'] },
  { name: 'Drizzle ORM', description: 'TypeScript ORM for SQL databases', website: 'https://orm.drizzle.team', github: 'https://github.com/drizzle-team/drizzle-orm', license: 'Apache-2.0', categories: ['Developer Tools', 'Database & Storage'], alternative_to: ['Prisma', 'TypeORM'] },
  { name: 'Kysely', description: 'Type-safe SQL query builder', website: 'https://kysely.dev', github: 'https://github.com/kysely-org/kysely', license: 'MIT', categories: ['Developer Tools', 'Database & Storage'], alternative_to: ['Knex.js'] },
  { name: 'SQLAlchemy', description: 'Python SQL toolkit and ORM', website: 'https://sqlalchemy.org', github: 'https://github.com/sqlalchemy/sqlalchemy', license: 'MIT', categories: ['Developer Tools', 'Database & Storage'], alternative_to: ['Django ORM'] },
  { name: 'SeaORM', description: 'Async and dynamic ORM for Rust', website: 'https://sea-ql.org/SeaORM', github: 'https://github.com/SeaQL/sea-orm', license: 'MIT', categories: ['Developer Tools', 'Database & Storage'], alternative_to: ['Diesel'] },

  // Static Site Generators
  { name: 'Zola', description: 'Fast static site generator in Rust', website: 'https://getzola.org', github: 'https://github.com/getzola/zola', license: 'MIT', categories: ['Content & Media', 'Developer Tools'], alternative_to: ['Hugo', 'Jekyll'] },
  { name: 'Pelican', description: 'Static site generator in Python', website: 'https://getpelican.com', github: 'https://github.com/getpelican/pelican', license: 'AGPL-3.0', categories: ['Content & Media', 'Developer Tools'], alternative_to: ['Jekyll'] },
  { name: 'Hexo', description: 'Fast blog framework powered by Node.js', website: 'https://hexo.io', github: 'https://github.com/hexojs/hexo', license: 'MIT', categories: ['Content & Media', 'Blogging Platforms'], alternative_to: ['Jekyll', 'Hugo'] },

  // Event Streaming & Message Queues
  { name: 'Redpanda Console', description: 'Kafka management UI', website: 'https://redpanda.com', github: 'https://github.com/redpanda-data/console', license: 'Apache-2.0', categories: ['Data & Analytics', 'Developer Tools'], alternative_to: ['Confluent Control Center'] },
  { name: 'Kafdrop', description: 'Kafka Web UI', website: 'https://github.com/obsidiandynamics/kafdrop', github: 'https://github.com/obsidiandynamics/kafdrop', license: 'Apache-2.0', categories: ['Data & Analytics', 'Developer Tools'], alternative_to: ['Confluent Control Center'] },
  { name: 'Kowl', description: 'Apache Kafka Web UI', website: 'https://github.com/cloudhut/kowl', github: 'https://github.com/cloudhut/kowl', license: 'Apache-2.0', categories: ['Data & Analytics', 'Developer Tools'], alternative_to: ['Confluent Control Center'] },

  // Testing Libraries
  { name: 'Testing Library', description: 'Simple testing utilities', website: 'https://testing-library.com', github: 'https://github.com/testing-library/react-testing-library', license: 'MIT', categories: ['Testing & QA', 'Developer Tools'], alternative_to: ['Enzyme'] },
  { name: 'Mock Service Worker', description: 'API mocking library', website: 'https://mswjs.io', github: 'https://github.com/mswjs/msw', license: 'MIT', categories: ['Testing & QA', 'Developer Tools'], alternative_to: ['Nock', 'Mirage JS'] },
  { name: 'Pact', description: 'Contract testing framework', website: 'https://pact.io', github: 'https://github.com/pact-foundation/pact-js', license: 'MIT', categories: ['Testing & QA'], alternative_to: ['Spring Cloud Contract'] },
  { name: 'Stryker', description: 'Mutation testing for JavaScript', website: 'https://stryker-mutator.io', github: 'https://github.com/stryker-mutator/stryker-js', license: 'Apache-2.0', categories: ['Testing & QA'], alternative_to: ['PIT Mutation Testing'] },

  // Mobile Development
  { name: 'Tauri', description: 'Build desktop apps with web tech', website: 'https://tauri.app', github: 'https://github.com/tauri-apps/tauri', license: 'MIT', categories: ['Developer Tools', 'Desktop Applications'], alternative_to: ['Electron'] },
  { name: 'Capacitor', description: 'Cross-platform native runtime', website: 'https://capacitorjs.com', github: 'https://github.com/ionic-team/capacitor', license: 'MIT', categories: ['Developer Tools', 'Mobile Development'], alternative_to: ['Cordova', 'React Native'] },
  { name: 'Expo', description: 'Platform for React Native', website: 'https://expo.dev', github: 'https://github.com/expo/expo', license: 'MIT', categories: ['Developer Tools', 'Mobile Development'], alternative_to: ['React Native CLI'] },

  // Headless CMS
  { name: 'Contentlayer', description: 'Content SDK for developers', website: 'https://contentlayer.dev', github: 'https://github.com/contentlayerdev/contentlayer', license: 'MIT', categories: ['Content Management (CMS)'], alternative_to: ['Contentful'] },
  { name: 'Hygraph', description: 'Federated content platform', website: 'https://hygraph.com', github: 'https://github.com/hygraph', license: 'MIT', categories: ['Content Management (CMS)'], alternative_to: ['Contentful'] },
];

// Proprietary software that may be missing
const newProprietarySoftware = [
  { name: 'JSLint', website: 'https://jslint.com', description: 'JavaScript code quality tool' },
  { name: 'JSHint', website: 'https://jshint.com', description: 'JavaScript code quality tool' },
  { name: 'Beautify', website: 'https://beautifier.io', description: 'Code beautifier' },
  { name: 'Pylint', website: 'https://pylint.org', description: 'Python static code analysis' },
  { name: 'Flake8', website: 'https://flake8.pycqa.org', description: 'Python code linter' },
  { name: 'npm', website: 'https://npmjs.com', description: 'Node.js package manager' },
  { name: 'Yarn', website: 'https://yarnpkg.com', description: 'JavaScript package manager' },
  { name: 'Node.js', website: 'https://nodejs.org', description: 'JavaScript runtime' },
  { name: 'Deno', website: 'https://deno.land', description: 'JavaScript/TypeScript runtime' },
  { name: 'Lerna', website: 'https://lerna.js.org', description: 'Monorepo management tool' },
  { name: 'Bazel', website: 'https://bazel.build', description: 'Build and test tool' },
  { name: 'Webpack', website: 'https://webpack.js.org', description: 'JavaScript module bundler' },
  { name: 'Parcel', website: 'https://parceljs.org', description: 'Zero config bundler' },
  { name: 'Babel', website: 'https://babeljs.io', description: 'JavaScript compiler' },
  { name: 'Apache Flink', website: 'https://flink.apache.org', description: 'Stream processing framework' },
  { name: 'Materialize', website: 'https://materialize.com', description: 'Streaming database' },
  { name: 'NVIDIA Triton', website: 'https://developer.nvidia.com/triton', description: 'Inference serving software' },
  { name: 'TensorRT-LLM', website: 'https://nvidia.github.io/TensorRT-LLM', description: 'LLM inference optimization' },
  { name: 'LangChain', website: 'https://langchain.com', description: 'LLM application framework' },
  { name: 'LlamaIndex', website: 'https://llamaindex.ai', description: 'Data framework for LLMs' },
  { name: 'Weights & Biases', website: 'https://wandb.ai', description: 'ML experiment tracking' },
  { name: 'Neptune.ai', website: 'https://neptune.ai', description: 'ML metadata store' },
  { name: 'SageMaker', website: 'https://aws.amazon.com/sagemaker', description: 'AWS ML platform' },
  { name: 'Vertex AI', website: 'https://cloud.google.com/vertex-ai', description: 'Google Cloud ML platform' },
  { name: 'Spark', website: 'https://spark.apache.org', description: 'Unified analytics engine' },
  { name: 'Dask', website: 'https://dask.org', description: 'Parallel computing library' },
  { name: 'Labelbox', website: 'https://labelbox.com', description: 'Data labeling platform' },
  { name: 'Scale AI', website: 'https://scale.com', description: 'AI data platform' },
  { name: 'LangSmith', website: 'https://smith.langchain.com', description: 'LLM debugging platform' },
  { name: 'Helicone', website: 'https://helicone.ai', description: 'LLM observability' },
  { name: 'Calico', website: 'https://projectcalico.org', description: 'Kubernetes networking' },
  { name: 'Flannel', website: 'https://github.com/flannel-io/flannel', description: 'Container networking' },
  { name: 'Consul Connect', website: 'https://consul.io', description: 'Service mesh' },
  { name: 'BeyondTrust', website: 'https://beyondtrust.com', description: 'Privileged access management' },
  { name: 'CyberArk', website: 'https://cyberark.com', description: 'Identity security' },
  { name: 'Docker Engine', website: 'https://docker.com', description: 'Container runtime' },
  { name: 'Docker Build', website: 'https://docs.docker.com/build', description: 'Container image building' },
  { name: 'Tilt', website: 'https://tilt.dev', description: 'Kubernetes development' },
  { name: 'Garden', website: 'https://garden.io', description: 'Kubernetes development' },
  { name: 'Jenkins X', website: 'https://jenkins-x.io', description: 'CI/CD for Kubernetes' },
  { name: 'Spinnaker', website: 'https://spinnaker.io', description: 'Multi-cloud CD platform' },
  { name: 'GitHub Actions', website: 'https://github.com/features/actions', description: 'CI/CD automation' },
  { name: 'Logstash', website: 'https://elastic.co/logstash', description: 'Data processing pipeline' },
  { name: 'Fluentd', website: 'https://fluentd.org', description: 'Data collector' },
  { name: 'Zipkin', website: 'https://zipkin.io', description: 'Distributed tracing' },
  { name: 'Sysdig Secure', website: 'https://sysdig.com', description: 'Container security' },
  { name: 'Aqua Security', website: 'https://aquasec.com', description: 'Cloud native security' },
  { name: 'OPA Gatekeeper', website: 'https://open-policy-agent.github.io/gatekeeper', description: 'Kubernetes policy controller' },
  { name: 'Docker Content Trust', website: 'https://docs.docker.com/engine/security/trust', description: 'Content signing' },
  { name: 'Fail2ban', website: 'https://fail2ban.org', description: 'Intrusion prevention' },
  { name: 'Cloudflare WAF', website: 'https://cloudflare.com/waf', description: 'Web application firewall' },
  { name: 'Snyk IaC', website: 'https://snyk.io/product/infrastructure-as-code-security', description: 'IaC security' },
  { name: 'Terraform Sentinel', website: 'https://terraform.io/sentinel', description: 'Policy as code' },
  { name: 'Gatsby', website: 'https://gatsbyjs.com', description: 'React-based framework' },
  { name: 'React', website: 'https://react.dev', description: 'JavaScript UI library' },
  { name: 'Vue.js', website: 'https://vuejs.org', description: 'JavaScript framework' },
  { name: 'Express.js', website: 'https://expressjs.com', description: 'Node.js web framework' },
  { name: 'TypeORM', website: 'https://typeorm.io', description: 'TypeScript ORM' },
  { name: 'Sequelize', website: 'https://sequelize.org', description: 'Node.js ORM' },
  { name: 'Knex.js', website: 'https://knexjs.org', description: 'SQL query builder' },
  { name: 'Django ORM', website: 'https://djangoproject.com', description: 'Python ORM' },
  { name: 'Diesel', website: 'https://diesel.rs', description: 'Rust ORM' },
  { name: 'Confluent Control Center', website: 'https://confluent.io', description: 'Kafka management' },
  { name: 'Enzyme', website: 'https://enzymejs.github.io/enzyme', description: 'React testing utilities' },
  { name: 'Nock', website: 'https://github.com/nock/nock', description: 'HTTP mocking library' },
  { name: 'Mirage JS', website: 'https://miragejs.com', description: 'API mocking library' },
  { name: 'Spring Cloud Contract', website: 'https://spring.io/projects/spring-cloud-contract', description: 'Contract testing' },
  { name: 'PIT Mutation Testing', website: 'https://pitest.org', description: 'Mutation testing for Java' },
  { name: 'Electron', website: 'https://electronjs.org', description: 'Desktop app framework' },
  { name: 'Cordova', website: 'https://cordova.apache.org', description: 'Mobile development platform' },
  { name: 'React Native', website: 'https://reactnative.dev', description: 'Cross-platform mobile framework' },
  { name: 'React Native CLI', website: 'https://reactnative.dev', description: 'React Native tooling' },
  { name: 'Contentful', website: 'https://contentful.com', description: 'Headless CMS' },
  { name: 'Rocket', website: 'https://rocket.rs', description: 'Rust web framework' },
  { name: 'Gin', website: 'https://gin-gonic.com', description: 'Go web framework' },
];

async function seedNewAlternatives() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // First, seed any missing proprietary software
    console.log('\n📁 Seeding missing proprietary software...');
    let propAddedCount = 0;
    for (const prop of newProprietarySoftware) {
      const slug = createSlug(prop.name);
      const existing = await ProprietarySoftware.findOne({
        $or: [{ slug }, { name: { $regex: `^${prop.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } }]
      });
      if (!existing) {
        try {
          await ProprietarySoftware.create({ ...prop, slug });
          propAddedCount++;
        } catch (err: any) {
          if (err.code !== 11000) console.error(`Error adding ${prop.name}:`, err.message);
        }
      }
    }
    console.log(`   Added ${propAddedCount} proprietary software`);

    // Get all categories and proprietary software for mapping
    const categories = await Category.find();
    const categoryMap = new Map(categories.map((c: any) => [c.name, c._id]));
    
    const proprietarySoftware = await ProprietarySoftware.find();
    const proprietaryMap = new Map(proprietarySoftware.map((p: any) => [p.name.toLowerCase(), p._id]));

    console.log('\n🚀 Seeding new alternatives...');
    let addedCount = 0;
    let skippedCount = 0;

    for (const alt of newAlternatives) {
      const slug = createSlug(alt.name);
      
      // Check if already exists
      const existing = await Alternative.findOne({
        $or: [{ slug }, { name: { $regex: `^${alt.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } }]
      });

      if (existing) {
        skippedCount++;
        continue;
      }

      // Map categories
      const categoryIds = alt.categories
        .map(catName => categoryMap.get(catName))
        .filter(Boolean);

      // Map alternative_to
      const alternativeToIds = alt.alternative_to
        .map(propName => proprietaryMap.get(propName.toLowerCase()))
        .filter(Boolean);

      try {
        await Alternative.create({
          name: alt.name,
          slug,
          description: alt.description,
          short_description: alt.description,
          website: alt.website,
          github_url: alt.github,
          license: alt.license,
          categories: categoryIds,
          alternative_to: alternativeToIds,
          upvotes: Math.floor(Math.random() * 500) + 50,
        });
        addedCount++;
        process.stdout.write(`\r   Added ${addedCount} alternatives (${skippedCount} skipped)`);
      } catch (err: any) {
        if (err.code === 11000) {
          skippedCount++;
        } else {
          console.error(`\n   Error adding ${alt.name}:`, err.message);
        }
      }
    }

    console.log(`\n\n✅ Seeded ${addedCount} new alternatives (${skippedCount} already existed)`);

    // Get final count
    const totalCount = await Alternative.countDocuments();
    console.log(`📊 Total alternatives in database: ${totalCount}`);

    console.log('\n🎉 Done!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

seedNewAlternatives();
