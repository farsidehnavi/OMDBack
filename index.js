const express = require("express");
const cors = require("cors");
const axios = require("axios");
const {
  ConnectDB,
  AddUser,
  FindUser,
  UpdateUserCredit,
} = require("./DatabaseManagement");

const app = express();

// Allow any origin
app.use(
  cors({
    origin: true, // Accept requests from any origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// app.options("*", cors());

app.use(express.json());

const HiddifyBaseUrl = "https://onemilliondollars.site";

const Login = async (res, Account) => {
  if (Account?.Username && Account?.Password) {
    try {
      const User = await FindUser(Account.Username, res);

      res.send(User);

      if (User && User.Password == Account.Password) {
        return User;
      } else {
        res.send({
          Url: "Login Func",
          Status: 401,
        });
      }
    } catch (error) {
      res.send({
        Url: "Login Func",
        Status: 500,
        Error: error,
      });
    }
  } else {
    res.send({
      Url: "Login Func",
      Status: 400,
    });
  }
};

app.get("/Hello", (req, res) => {
  res.send("Hello from Backend !");
});

app.post("/Load", (req, res) => {
  res.send("!!!!!!! You hitted /Load !!!!!!");
});

app.post("/api/Load", async (req, res) => {
  const Resault = await ConnectDB();
  if (Resault) {
    res.send({
      Url: "/Load",
      Status: 500,
      Error: Resault,
    });
  } else {
    res.send({
      Url: "/Load",
      Status: 200,
    });
  }
});

app.post("/api/Login", async (req, res) => {
  const User = await Login(res, req?.body);
  if (User) {
    res.send({
      Url: "/Login",
      Status: 200,
      Credit: User.Credit,
    });
  }
});

const GetProfiles = async (User, res) => {
  const options = {
    method: "GET",
    url: HiddifyBaseUrl + `/${User.ProxyPath}/api/v2/admin/user/`,
    headers: {
      Accept: "application/json",
      "Hiddify-API-Key": User.HiddifyAPIKey,
    },
  };
  try {
    const response = await axios.request(options);
    // console.log(response);
    res.send({
      Url: "/Profiles",
      Status: 200,
      Data: response.data,
    });
  } catch (error) {
    res.send({
      Url: "/Profiles",
      Status: 500,
      Error: error,
    });
  }
};

app.post("/api/Profiles", async (req, res) => {
  const User = await Login(res, req?.body);
  if (User) {
    await GetProfiles(User, res);
  }
});

app.post("/api/Profiles2", async (req, res) => {
  const User = await Login(res, req?.body);
  if (User) {
    res.send({
      Url: "Profiles2",
      Status: 200,
      Data: [
        {
          added_by_uuid: "954f753b-7de9-4bc6-9721-5b04c7ecc9db",
          comment: "",
          current_usage_GB: 0,
          ed25519_private_key:
            "-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZWQyNTUx\nOQAAACBd7BwiHZOJDOXsVu8e1z6WgUrXp99SSqjqwOJxAIsRJwAAAIjberq423q6uAAAAAtzc2gt\nZWQyNTUxOQAAACBd7BwiHZOJDOXsVu8e1z6WgUrXp99SSqjqwOJxAIsRJwAAAEDrLkYE8cqtbhzj\nE8fzluzAd1Im/zuOQ7FK5EYk8977L13sHCIdk4kM5exW7x7XPpaBSten31JKqOrA4nEAixEnAAAA\nAAECAwQF\n-----END OPENSSH PRIVATE KEY-----\n",
          ed25519_public_key:
            "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIF3sHCIdk4kM5exW7x7XPpaBSten31JKqOrA4nEAixEn",
          enable: true,
          id: 21,
          is_active: true,
          lang: "en",
          last_online: "0001-01-01 00:00:00",
          last_reset_time: "2025-08-26 00:00:00",
          mode: "no_reset",
          name: "Test",
          package_days: 90,
          start_date: null,
          telegram_id: null,
          usage_limit_GB: 1000,
          uuid: "ed008046-dd8c-48cd-9199-5168eee06715",
          wg_pk: "eDezvjQ/nxwelf9Ct0bjpWFKndP38vOexpUaxyPTCXQ=",
          wg_psk: "+bilZtMrwMHpjBHXGSBMlPCxUzE9XelNKSEECHCR0Rg=",
          wg_pub: "VKLMPpjVWZ04rhygC32qluKDJRV5ulImKVChm8eZxww=",
        },
      ],
    });
  }
});

const UpdateProfile = async (uuid, User, GB, res) => {
  const options = {
    method: "PATCH",
    url:
      HiddifyBaseUrl +
      `/${User.ProxyPath}/api/v2/admin/user/ed008046-dd8c-48cd-9199-5168eee06715/`,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Hiddify-API-Key": User.HiddifyAPIKey,
    },
    data: {
      added_by_uuid: User.HiddifyAPIKey,
      comment: null,
      current_usage_GB: 0,
      ed25519_private_key: null,
      ed25519_public_key: null,
      enable: true,
      is_active: true,
      lang: null,
      last_online: null,
      last_reset_time: null,
      mode: null,
      name: null,
      package_days: 30,
      start_date: null,
      telegram_id: 0,
      usage_limit_GB: GB,
      uuid: uuid,
      wg_pk: null,
      wg_psk: null,
      wg_pub: null,
    },
  };

  // res.send(options)

  try {
    const { data } = await axios.request(options);
    return {
      Status: 200,
      Data: data,
    };
  } catch (error) {
    res.send({
      Url: "Update profile func",
      Status: 500,
      Error: error,
    });
  }
};

// const Active = async (req, res, User) => {
//   let Profile = req?.body?.Profile
//   Profile.enable = req?.body?.IsActive
//   if (Profile) {
//     await UpdateProfile(Profile, User, res);
//   } else {
//     res.send({
//       Url: "/Active",
//       Status: 400,
//       Error: "Didn't recive profile",
//     });
//   }
// };

// app.post("/Active", async (req, res) => {
//   // BodyExample
//   // ({
//   //   Account: {
//   //     Username: 'admin',
//   //     Password: 'admin'
//   //   },
//   //   Profile: {
//   //     Name: 'Test',
//   //       ...
//   //   },
//   //   IsActive: false
//   // })
//   const User = await Login(res, req?.body?.Account);
//   if (User) {
//     res.send(req.body)
//     // await Active(req, res, User);
//   }
// });

const Renew = async (uuid, User, GB, res) => {
  if (User.Credit >= GB) {
    const Resault = await UpdateProfile(uuid, User, GB, res);
    res.send(Resault);
    if (Resault.Status == 200) {
      await UpdateUserCredit(User.Username, User.Credit - GB);
    }
  } else {
    res.send({
      Status: 400,
      Url: "Renew func",
      Error: "You've run out of credit !",
    });
  }
};

app.post("/api/Renew", async (req, res) => {
  // BodyExample
  // ({
  //   Account: {
  //     Username: 'admin',
  //     Password: 'admin',
  //   },
  //   uuid: '...',
  //   GB: 20,
  // })
  const User = await Login(res, req.body?.Account);
  if (User) {
    await Renew(req.body?.uuid, User, req.body?.GB, res);
  }
});

const AddProfileRequest = async (User, Name, GB, res) => {
  const options = {
    method: "POST",
    url: HiddifyBaseUrl + `/${User.ProxyPath}/api/v2/admin/user/`,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Hiddify-API-Key": User.HiddifyAPIKey,
    },
    data: {
      added_by_uuid: null,
      comment: null,
      current_usage_GB: 0,
      ed25519_private_key: null,
      ed25519_public_key: null,
      enable: true,
      is_active: true,
      lang: "en",
      last_online: null,
      last_reset_time: null,
      mode: "no_reset",
      name: Name,
      package_days: 30,
      start_date: null,
      telegram_id: 0,
      usage_limit_GB: GB,
      uuid: null,
      wg_pk: null,
      wg_psk: null,
      wg_pub: null,
    },
  };

  try {
    const { data } = await axios.request(options);
    return {
      Status: 200,
      Data: data,
      Url: "AddProfile func",
    };
  } catch (error) {
    res.send({
      Url: "AddProfile func",
      Status: 500,
      Error: error,
    });
  }
};

const AddProfile = async (User, Name, GB, res) => {
  if (User.Credit >= GB) {
    const Resault = await AddProfileRequest(User, Name, GB, res);
    res.send(Resault);
    if (Resault.Status == 200) {
      await UpdateUserCredit(User.Username, User.Credit - GB);
    }
  } else {
    res.send({
      Status: 400,
      Url: "AddProfile func",
      Error: "You've run out of credit !",
    });
  }
};

app.post("/api/AddProfile", async (req, res) => {
  // BodyExample
  // ({
  //   Account: {
  //     Username: 'admin',
  //     Password: 'admin'
  //   },
  //   Name: 'Ali',
  //   GB: 30,
  // })
  const User = await Login(res, req.body?.Account);
  if (User) {
    await AddProfile(User, req.body?.Name, req.body?.GB, res);
  }
});

const LinkRequest = async (uuid, User, res) => {
  const options = {
    method: "GET",
    url: HiddifyBaseUrl + "/XsaTUPj2mABSXD3LgO/api/v2/user/all-configs/",
    headers: {
      Accept: "application/json",
      "Hiddify-API-Key": uuid,
    },
  };

  // console.log(options);

  try {
    const { data } = await axios.request(options);
    return {
      Status: 200,
      Data: data,
      Url: "GetLink func",
    };
  } catch (error) {
    res.send({
      Url: "GetLink func",
      Status: 500,
      Error: error,
    });
  }
};

app.post("/api/GetLink", async (req, res) => {
  // ExampleData
  // ({
  //   Account: { ... },
  //   uuid: '...',
  // })
  const User = await Login(res, req.body.Account);
  if (User) {
    const Resault = await LinkRequest(req.body.uuid, User, res);
    if (Resault.Status == 200) {
      res.send({
        Status: 200,
        Link: Resault.Data[9].link,
        Url: "/GetLink",
      });
    }
  }
});

const GetTimeRequest = async (User, uuid, res) => {
  const options = {
    method: "GET",
    url: HiddifyBaseUrl + `/${User.ProxyPath}/api/v2/admin/user/${uuid}/`,
    headers: {
      Accept: "application/json",
      "Hiddify-API-Key": User.HiddifyAPIKey,
    },
  };

  try {
    const { data } = await axios.request(options);
    res.send(data);
    return {
      Status: 200,
      Data: data,
      Url: "GetTime func",
    };
  } catch (error) {
    res.send({
      Url: "GetTime func",
      Status: 500,
      Error: error,
    });
  }
};

function formatRemainingTime(startDateStr, durationDays) {
  const start = new Date(startDateStr.replace(" ", "T"));
  const end = new Date(start.getTime() + durationDays * 24 * 60 * 60 * 1000);
  const now = new Date();

  if (end < now) return "Expired";

  const diffMs = end.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears >= 1)
    return `${diffYears} year${diffYears > 1 ? "s" : ""} available`;
  if (diffMonths >= 1)
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""} available`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} available`;
}

const GetTime = async (User, uuid, res) => {
  const Resault = await GetTimeRequest(User, uuid, res);
  if (Resault.Status == 200) {
    res.send({
      Status: 200,
      Time: formatRemainingTime(
        Resault.Data.start_date,
        Resault.Data.package_days
      ),
      Url: "/GetTime",
    });
  }
};

app.post("/api/GetTime", async (req, res) => {
  // BodyExample
  // ({
  //   Account: { ... },
  //   uuid: '...'
  // })
  const User = await Login(res, req.body.Account);
  if (User) {
    await GetTime(User, req.body.uuid, res);
  }
});

app.get("/AddUser", (req, res) => {
  AddUser(
    "admin",
    "admin",
    150,
    "954f753b-7de9-4bc6-9721-5b04c7ecc9db",
    "oI9KaIUAe6AwB9B"
  );
  res.send("User added successfully !");
});

app.post("/api/UpdateCredit", async (req, res) => {
  // ExampleData
  // ({
  //   Account: { ... },
  //   CreditToAdd: 150,
  // })
  const User = await Login(res, req.body?.Account);
  if (User) {
    UpdateUserCredit(User.Username, User.Credit + req.body?.CreditToAdd);
  }
  res.send({
    Status: 200,
    Url: "/UpdateCredit",
  });
});

app.all("/api/debug-cors", (req, res) => {
  res.send({
    method: req.method,
    origin: req.headers.origin,
    "access-control-request-method":
      req.headers["access-control-request-method"],
    "access-control-request-headers":
      req.headers["access-control-request-headers"],
    headers: req.headers,
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  // console.log(`Server running on http://localhost:${PORT}`);
});
