(function () {
  var API_BASE = "http://localhost:3000";

  bindRoleSwitch();

  document.querySelectorAll("form[data-demo-auth]").forEach(function (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      clearFeedback(form);

      try {
        if (form.id === "signupForm") {
          await handleSignup(form);
        } else if (form.id === "loginForm") {
          await handleLogin(form);
        }
      } catch (err) {
        showFeedback(form, err.message || "Something went wrong. Please try again.", "error");
      }
    });
  });

  async function handleLogin(form) {
    var username = valueOf(form, "username");
    var password = valueOf(form, "password");

    var response = await fetch(API_BASE + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username: username, password: password }),
    });

    var data = await safeJson(response);
    if (!response.ok || !data.success) {
      throw new Error((data && data.message) || "Login failed.");
    }

    showFeedback(form, "Login successful. Redirecting to homepage...", "success");
    setTimeout(function () {
      window.location.href = "index.html";
    }, 700);
  }

  async function handleSignup(form) {
    var username = valueOf(form, "username");
    var name = valueOf(form, "name");
    var email = valueOf(form, "email");
    var password = valueOf(form, "password");
    var password2 = valueOf(form, "password2");
    var role = valueOf(form, "role") || "rider";

    if (password !== password2) {
      throw new Error("Passwords do not match.");
    }

    var payload = {
      username: username,
      email: email,
      password: password,
      role: role,
      roleDetails: buildRoleDetails(form, role, name),
    };

    var response = await fetch(API_BASE + "/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    var data = await safeJson(response);
    if (!response.ok || !data.success) {
      throw new Error((data && data.message) || "Signup failed.");
    }

    showFeedback(form, "Account created. Redirecting to login...", "success");
    setTimeout(function () {
      window.location.href = "login.html";
    }, 900);
  }

  function valueOf(form, name) {
    var input = form.querySelector('[name="' + name + '"]');
    return input ? String(input.value || "").trim() : "";
  }

  function listFromCsv(value) {
    if (!value) return [];
    return String(value)
      .split(",")
      .map(function (item) {
        return item.trim();
      })
      .filter(Boolean);
  }

  function buildRoleDetails(form, role, name) {
    if (role === "organizer") {
      return {
        name: name,
        description: valueOf(form, "orgDescription"),
        socialLinks: valueOf(form, "orgSocial"),
        website: valueOf(form, "orgWebsite"),
        gstin: valueOf(form, "orgGstin"),
      };
    }

    if (role === "sponsor") {
      return {
        name: name,
        brandName: valueOf(form, "sponsorBrand"),
        website: valueOf(form, "sponsorWebsite"),
        description: valueOf(form, "sponsorDescription"),
      };
    }

    var riderAge = valueOf(form, "riderAge");
    return {
      name: name,
      age: riderAge ? Number(riderAge) : null,
      city: valueOf(form, "riderCity"),
      socialLinks: valueOf(form, "riderSocial"),
      bikes: listFromCsv(valueOf(form, "riderBikes")),
      ridingStyle: listFromCsv(valueOf(form, "riderStyle")),
      bio: valueOf(form, "riderBio"),
    };
  }

  function bindRoleSwitch() {
    var roleSelect = document.querySelector("#signup-role");
    if (!roleSelect) return;

    var blocks = document.querySelectorAll("[data-role-block]");
    function syncRoleBlocks() {
      var current = roleSelect.value;
      blocks.forEach(function (block) {
        var isMatch = block.getAttribute("data-role-block") === current;
        block.classList.toggle("hidden", !isMatch);
      });
    }

    roleSelect.addEventListener("change", syncRoleBlocks);
    syncRoleBlocks();
  }

  async function safeJson(response) {
    try {
      return await response.json();
    } catch (_) {
      return {};
    }
  }

  function clearFeedback(form) {
    var el = getFeedbackEl(form);
    if (!el) return;
    el.hidden = true;
    el.textContent = "";
    el.classList.remove("is-error", "is-success");
  }

  function showFeedback(form, message, type) {
    var el = getFeedbackEl(form);
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
    el.classList.remove("is-error", "is-success");
    if (type === "error") el.classList.add("is-error");
    if (type === "success") el.classList.add("is-success");
  }

  function getFeedbackEl(form) {
    var card = form.closest(".auth-card");
    var el = card ? card.querySelector(".auth-feedback") : null;
    if (!el) el = document.getElementById("authFeedback");
    return el;
  }
})();
