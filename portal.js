const storageKey = "apexFundingClients";

const defaultClients = [
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
    status: "pending",
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

let clients = loadClients();

const money = new Intl.NumberFormat("en-MY", {
  style: "currency",
  currency: "MYR",
  maximumFractionDigits: 0,
});

const views = ["dashboard", "clients", "loans", "documents"];

const state = {
  activeId: clients[0].id,
  filter: "all",
  query: "",
  view: getViewFromHash(),
  editingId: null,
};

const elements = {
  navItems: document.querySelectorAll(".nav-item"),
  toggleForm: document.querySelector("#toggleFormButton"),
  closeForm: document.querySelector("#closeFormButton"),
  formPanel: document.querySelector("#applicationFormPanel"),
  form: document.querySelector("#applicationForm"),
  cancelEdit: document.querySelector("#cancelEditButton"),
  editCustomer: document.querySelector("#editCustomerButton"),
  resetDemo: document.querySelector("#resetDemoButton"),
  viewSections: document.querySelectorAll(".view-section"),
  totalApproved: document.querySelector("#totalApproved"),
  activeClients: document.querySelector("#activeClients"),
  dueThisWeek: document.querySelector("#dueThisWeek"),
  loanCount: document.querySelector("#loanCount"),
  loanTable: document.querySelector("#loanTable"),
  documentCount: document.querySelector("#documentCount"),
  documentTable: document.querySelector("#documentTable"),
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

function loadClients() {
  const stored = readStoredClients();
  if (!stored) {
    return [...defaultClients];
  }

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length ? parsed : [...defaultClients];
  } catch {
    return [...defaultClients];
  }
}

function saveClients() {
  writeStoredClients(JSON.stringify(clients));
}

function readStoredClients() {
  try {
    return window.localStorage?.getItem(storageKey);
  } catch {
    return null;
  }
}

function writeStoredClients(value) {
  try {
    window.localStorage?.setItem(storageKey, value);
  } catch {
    // Some embedded browsers disable localStorage; the in-memory list still works.
  }
}

function clearStoredClients() {
  try {
    window.localStorage?.removeItem(storageKey);
  } catch {
    // Ignore unavailable storage.
  }
}

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
    .map((client) => {
      const name = escapeHtml(client.name);
      const role = escapeHtml(client.role);
      const location = escapeHtml(client.location);

      return `
        <button class="client-card ${client.id === state.activeId ? "selected" : ""}" type="button" data-id="${client.id}">
          <div class="client-card-header">
            <div>
              <h3>${name}</h3>
              <p>${role} - ${location}</p>
            </div>
            ${renderStatusPill(client.status)}
          </div>
          <div class="mini-stat">
            <span>${money.format(client.loanAmount)} loan</span>
            <strong>${client.term} months</strong>
          </div>
        </button>
      `;
    })
    .join("") || `<div class="empty-state">No customers found.</div>`;

  elements.list.querySelectorAll(".client-card").forEach((card) => {
    card.addEventListener("click", () => {
      state.activeId = card.dataset.id;
      render();
    });
  });
}

function renderProfile() {
  const active = getActiveClient();
  if (!active) {
    return;
  }
  state.activeId = active.id;
  const percent = Math.min(100, Math.round((active.paid / active.term) * 100));

  elements.status.outerHTML = renderStatusPill(active.status, "clientStatus");
  elements.status = document.querySelector("#clientStatus");
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

function renderMetrics() {
  const approvedClients = clients.filter((client) => client.status === "approved");
  const totalApproved = approvedClients.reduce((sum, client) => sum + client.loanAmount, 0);
  const dueThisWeek = approvedClients.reduce((sum, client) => sum + client.monthlyPayment, 0);
  const pendingDocs = clients.reduce(
    (sum, client) => sum + client.documents.filter(([, status]) => status !== "verified").length,
    0,
  );

  elements.totalApproved.textContent = money.format(totalApproved);
  elements.activeClients.textContent = `Across ${approvedClients.length} approved clients`;
  elements.dueThisWeek.textContent = money.format(dueThisWeek);
  document.querySelector(".metric-card:nth-child(3) strong").textContent = pendingDocs;
}

function renderViews() {
  elements.navItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.view === state.view);
  });

  elements.viewSections.forEach((section) => {
    const visibleViews = section.dataset.section.split(" ");
    section.hidden = !visibleViews.includes(state.view);
  });
}

function renderLoansView() {
  elements.loanCount.textContent = `${clients.length} record${clients.length === 1 ? "" : "s"}`;
  elements.loanTable.innerHTML = `
    <div class="table-row header">
      <span>Customer</span>
      <span>Amount</span>
      <span>Term</span>
      <span>Monthly</span>
      <span>Status</span>
      <span>Risk</span>
    </div>
    ${clients
      .map(
        (client) => `
          <button class="table-row" type="button" data-loan-id="${client.id}">
            <strong>${escapeHtml(client.name)}</strong>
            <span>${money.format(client.loanAmount)}</span>
            <span>${client.term} months</span>
            <span>${money.format(client.monthlyPayment)}</span>
            ${renderStatusPill(client.status)}
            <span>${escapeHtml(client.risk)}</span>
          </button>
        `,
      )
      .join("")}
  `;

  elements.loanTable.querySelectorAll("[data-loan-id]").forEach((row) => {
    row.addEventListener("click", () => {
      state.activeId = row.dataset.loanId;
      state.view = "clients";
      render();
    });
  });
}

function renderDocumentsView() {
  const rows = clients.flatMap((client) =>
    client.documents.map(([name, status]) => ({
      client,
      name,
      status,
    })),
  );

  elements.documentCount.textContent = `${rows.length} item${rows.length === 1 ? "" : "s"}`;
  elements.documentTable.innerHTML = `
    <div class="table-row document-table-row header">
      <span>Customer</span>
      <span>Document</span>
      <span>Status</span>
      <span>Loan Status</span>
    </div>
    ${rows
      .map(
        ({ client, name, status }) => `
          <button class="table-row document-table-row" type="button" data-doc-client-id="${client.id}">
            <strong>${escapeHtml(client.name)}</strong>
            <span>${escapeHtml(name)}</span>
            <span class="doc-status ${status}">${labelStatus(status)}</span>
            ${renderStatusPill(client.status)}
          </button>
        `,
      )
      .join("")}
  `;

  elements.documentTable.querySelectorAll("[data-doc-client-id]").forEach((row) => {
    row.addEventListener("click", () => {
      state.activeId = row.dataset.docClientId;
      state.view = "clients";
      render();
    });
  });
}

function formatDate(value) {
  if (!value) {
    return "Pending confirmation";
  }

  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString("en-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getActiveClient() {
  return clients.find((client) => client.id === state.activeId) || filteredClients()[0] || clients[0];
}

function getViewFromHash() {
  const view = window.location.hash.replace("#", "");
  return views.includes(view) ? view : "dashboard";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderStatusPill(status, id = "") {
  const idAttribute = id ? ` id="${id}"` : "";
  const loader = status === "pending" ? `<span class="loading-ring" aria-hidden="true"></span>` : "";
  return `<span${idAttribute} class="status-pill ${status}">${loader}${labelStatus(status)}</span>`;
}

function createClientFromForm(form, existingId = null) {
  const data = new FormData(form);
  const term = Number(data.get("term"));
  const paid = Math.min(Number(data.get("paid")), term);

  return {
    id: existingId || `c-${Date.now()}`,
    name: data.get("name").trim(),
    role: data.get("role").trim(),
    location: data.get("location").trim(),
    status: data.get("status"),
    ic: data.get("ic").trim(),
    phone: data.get("phone").trim(),
    email: data.get("email").trim() || "Not provided",
    address: data.get("address").trim(),
    loanAmount: Number(data.get("loanAmount")),
    term,
    monthlyPayment: Number(data.get("monthlyPayment")),
    interest: data.get("interest").trim(),
    paid,
    balance: Number(data.get("balance")),
    rawNextDue: data.get("nextDue"),
    nextDue: formatDate(data.get("nextDue")),
    risk: data.get("risk"),
    documents: [
      ["NRIC / Passport", "pending"],
      ["Bank Statement", "pending"],
      ["Business Registration", "pending"],
      ["Income Proof", "pending"],
    ],
  };
}

function labelStatus(status) {
  const labels = {
    approved: "Approved",
    review: "Review",
    pending: "Pending",
    verified: "Verified",
    pending: "Pending",
    missing: "Missing",
  };
  return labels[status] || status;
}

function render() {
  renderViews();
  renderMetrics();
  renderClientList();
  renderProfile();
  renderLoansView();
  renderDocumentsView();
}

function openApplicationForm(mode) {
  elements.formPanel.hidden = false;
  elements.formPanel.querySelector("h2").textContent = mode === "edit" ? "Edit Loan Application" : "Add Loan Application";
  elements.formPanel.querySelector(".eyebrow").textContent = mode === "edit" ? "Update Customer" : "New Customer";
  elements.form.querySelector("button[type='submit']").textContent = mode === "edit" ? "Save Changes" : "Save Customer";
  elements.cancelEdit.hidden = mode !== "edit";
  elements.form.querySelector("input[name='name']").focus();
}

function closeApplicationForm() {
  state.editingId = null;
  elements.form.reset();
  elements.cancelEdit.hidden = true;
  elements.formPanel.hidden = true;
  elements.formPanel.querySelector("h2").textContent = "Add Loan Application";
  elements.formPanel.querySelector(".eyebrow").textContent = "New Customer";
  elements.form.querySelector("button[type='submit']").textContent = "Save Customer";
}

function populateForm(client) {
  const fields = elements.form.elements;
  fields.name.value = client.name;
  fields.role.value = client.role;
  fields.location.value = client.location;
  fields.ic.value = client.ic;
  fields.phone.value = client.phone;
  fields.email.value = client.email === "Not provided" ? "" : client.email;
  fields.address.value = client.address;
  fields.loanAmount.value = client.loanAmount;
  fields.term.value = client.term;
  fields.monthlyPayment.value = client.monthlyPayment;
  fields.interest.value = client.interest;
  fields.paid.value = client.paid;
  fields.balance.value = client.balance;
  fields.nextDue.value = client.rawNextDue || "";
  fields.status.value = client.status;
  fields.risk.value = client.risk;
}

elements.navItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    setPortalView(item.dataset.view);
  });
});

function setPortalView(view, updateHash = true) {
  if (!views.includes(view)) {
    return;
  }

  state.view = view;
  if (updateHash && window.location.hash !== `#${view}`) {
    window.location.hash = view;
  }
  closeApplicationForm();
  render();
}

window.setPortalView = setPortalView;

window.addEventListener("hashchange", () => {
  setPortalView(getViewFromHash(), false);
});


elements.toggleForm.addEventListener("click", () => {
  state.editingId = null;
  elements.form.reset();
  openApplicationForm("add");
});

elements.closeForm.addEventListener("click", () => {
  closeApplicationForm();
});

elements.cancelEdit.addEventListener("click", () => {
  closeApplicationForm();
});

elements.editCustomer.addEventListener("click", () => {
  const active = getActiveClient();
  if (!active) {
    return;
  }

  state.view = "clients";
  state.editingId = active.id;
  populateForm(active);
  openApplicationForm("edit");
  renderViews();
});

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const editedClient = createClientFromForm(elements.form, state.editingId);

  if (state.editingId) {
    clients = clients.map((client) => (client.id === state.editingId ? editedClient : client));
  } else {
    clients = [editedClient, ...clients];
  }

  state.activeId = editedClient.id;
  state.filter = "all";
  state.query = "";
  state.editingId = null;
  elements.search.value = "";
  elements.tabs.forEach((item) => item.classList.toggle("active", item.dataset.filter === "all"));
  saveClients();
  closeApplicationForm();
  render();
});

elements.resetDemo.addEventListener("click", () => {
  clients = [...defaultClients];
  state.activeId = clients[0].id;
  state.filter = "all";
  state.query = "";
  elements.search.value = "";
  elements.tabs.forEach((item) => item.classList.toggle("active", item.dataset.filter === "all"));
  clearStoredClients();
  render();
});

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
