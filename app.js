const clients = [
  {
    id: "c-001",
    name: "Daniel Lim",
    role: "SME Owner",
    location: "Kuala Lumpur",
    status: "approved",
    ic: "DEMO-ID-001",
    phone: "+60 00-000 0001",
    email: "demo.client1@apexfunding.example",
    address: "Demo Business District, Kuala Lumpur",
    loanAmount: 180000,
    term: 36,
    monthlyPayment: 5780,
    interest: "8.8% p.a.",
    paid: 18,
    balance: 98260,
    nextDue: "03 Sep 2026",
    risk: "Low",
    documents: [
      ["NRIC / Passport", "verified"],
      ["Bank Statement", "verified"],
      ["Business Registration", "verified"],
      ["Income Proof", "pending"],
    ],
  },
  {
    id: "c-002",
    name: "Aisha Rahman",
    role: "Restaurant Director",
    location: "Petaling Jaya",
    status: "approved",
    ic: "DEMO-ID-002",
    phone: "+60 00-000 0002",
    email: "demo.client2@apexfunding.example",
    address: "Demo Commercial Area, Petaling Jaya",
    loanAmount: 95000,
    term: 24,
    monthlyPayment: 4385,
    interest: "9.2% p.a.",
    paid: 7,
    balance: 69120,
    nextDue: "08 Sep 2026",
    risk: "Low",
    documents: [
      ["NRIC / Passport", "verified"],
      ["Bank Statement", "verified"],
      ["Business Registration", "pending"],
      ["Income Proof", "verified"],
    ],
  },
  {
    id: "c-003",
    name: "Jason Wong",
    role: "Property Agent",
    location: "Johor Bahru",
    status: "review",
    ic: "DEMO-ID-003",
    phone: "+60 00-000 0003",
    email: "demo.client3@apexfunding.example",
    address: "Demo Client Address, Johor Bahru",
    loanAmount: 260000,
    term: 48,
    monthlyPayment: 6650,
    interest: "10.4% p.a.",
    paid: 0,
    balance: 260000,
    nextDue: "Pending approval",
    risk: "Medium",
    documents: [
      ["NRIC / Passport", "verified"],
      ["Bank Statement", "pending"],
      ["Business Registration", "missing"],
      ["Income Proof", "pending"],
    ],
  },
  {
    id: "c-004",
    name: "Priya Menon",
    role: "Clinic Partner",
    location: "Subang Jaya",
    status: "approved",
    ic: "DEMO-ID-004",
    phone: "+60 00-000 0004",
    email: "demo.client4@apexfunding.example",
    address: "Demo Client Address, Subang Jaya",
    loanAmount: 140000,
    term: 30,
    monthlyPayment: 5280,
    interest: "8.6% p.a.",
    paid: 12,
    balance: 82410,
    nextDue: "11 Sep 2026",
    risk: "Low",
    documents: [
      ["NRIC / Passport", "verified"],
      ["Bank Statement", "verified"],
      ["Business Registration", "verified"],
      ["Income Proof", "verified"],
    ],
  },
];

const money = new Intl.NumberFormat("en-MY", {
  style: "currency",
  currency: "MYR",
  maximumFractionDigits: 0,
});

const state = {
  activeId: clients[0].id,
  filter: "all",
  query: "",
};

const elements = {
  search: document.querySelector("#clientSearch"),
  tabs: document.querySelectorAll(".tab"),
  list: document.querySelector("#clientList"),
  count: document.querySelector("#clientCount"),
  status: document.querySelector("#clientStatus"),
  name: document.querySelector("#clientName"),
  meta: document.querySelector("#clientMeta"),
  loanAmount: document.querySelector("#loanAmount"),
  loanTerm: document.querySelector("#loanTerm"),
  monthlyPayment: document.querySelector("#monthlyPayment"),
  interestRate: document.querySelector("#interestRate"),
  clientId: document.querySelector("#clientId"),
  phone: document.querySelector("#clientPhone"),
  email: document.querySelector("#clientEmail"),
  address: document.querySelector("#clientAddress"),
  paidLabel: document.querySelector("#paidLabel"),
  progress: document.querySelector("#progressBar"),
  balance: document.querySelector("#balance"),
  nextDue: document.querySelector("#nextDue"),
  risk: document.querySelector("#riskLevel"),
  documents: document.querySelector("#documentList"),
};

function filteredClients() {
  const query = state.query.trim().toLowerCase();
  return clients.filter((client) => {
    const statusMatch = state.filter === "all" || client.status === state.filter;
    const text = [
      client.name,
      client.role,
      client.location,
      client.ic,
      client.email,
      client.phone,
    ]
      .join(" ")
      .toLowerCase();
    return statusMatch && (!query || text.includes(query));
  });
}

function renderClientList() {
  const visibleClients = filteredClients();
  elements.count.textContent = `${visibleClients.length} client${visibleClients.length === 1 ? "" : "s"}`;

  elements.list.innerHTML = visibleClients
    .map(
      (client) => `
        <button class="client-card ${client.id === state.activeId ? "selected" : ""}" type="button" data-id="${client.id}">
          <div class="client-card-header">
            <div>
              <h3>${client.name}</h3>
              <p>${client.role} - ${client.location}</p>
            </div>
            <span class="status-pill ${client.status}">${labelStatus(client.status)}</span>
          </div>
          <div class="mini-stat">
            <span>${money.format(client.loanAmount)} loan</span>
            <strong>${client.term} months</strong>
          </div>
        </button>
      `,
    )
    .join("");

  elements.list.querySelectorAll(".client-card").forEach((card) => {
    card.addEventListener("click", () => {
      state.activeId = card.dataset.id;
      render();
    });
  });
}

function renderProfile() {
  const active = clients.find((client) => client.id === state.activeId) || filteredClients()[0] || clients[0];
  state.activeId = active.id;
  const percent = Math.round((active.paid / active.term) * 100);

  elements.status.textContent = labelStatus(active.status);
  elements.status.className = `status-pill ${active.status}`;
  elements.name.textContent = active.name;
  elements.meta.textContent = `${active.role} - ${active.location}`;
  elements.loanAmount.textContent = money.format(active.loanAmount);
  elements.loanTerm.textContent = `${active.term} months`;
  elements.monthlyPayment.textContent = money.format(active.monthlyPayment);
  elements.interestRate.textContent = active.interest;
  elements.clientId.textContent = active.ic;
  elements.phone.textContent = active.phone;
  elements.email.textContent = active.email;
  elements.address.textContent = active.address;
  elements.paidLabel.textContent = `${active.paid} / ${active.term} paid`;
  elements.progress.style.width = `${percent}%`;
  elements.balance.textContent = money.format(active.balance);
  elements.nextDue.textContent = active.nextDue;
  elements.risk.textContent = active.risk;

  elements.documents.innerHTML = active.documents
    .map(
      ([name, status]) => `
        <div class="document-row">
          <strong>${name}</strong>
          <span class="doc-status ${status}">${labelStatus(status)}</span>
        </div>
      `,
    )
    .join("");
}

function labelStatus(status) {
  const labels = {
    approved: "Approved",
    review: "Review",
    verified: "Verified",
    pending: "Pending",
    missing: "Missing",
  };
  return labels[status] || status;
}

function render() {
  renderClientList();
  renderProfile();
}

elements.search.addEventListener("input", (event) => {
  state.query = event.target.value;
  const firstVisible = filteredClients()[0];
  if (firstVisible && !filteredClients().some((client) => client.id === state.activeId)) {
    state.activeId = firstVisible.id;
  }
  render();
});

elements.tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    state.filter = tab.dataset.filter;
    elements.tabs.forEach((item) => item.classList.toggle("active", item === tab));
    const firstVisible = filteredClients()[0];
    if (firstVisible) {
      state.activeId = firstVisible.id;
    }
    render();
  });
});

render();
