export const beneficiaries = {
  methods: {
    beneficiaries: function (v) {
      let flag = false;
      if (v.beneficiaries.length > 0) {
        let benLen = v.beneficiaries.length;
        for (let i = 0; i < benLen; ++i) {
          if (v.beneficiaries[i].account == "viboard" && v.beneficiaries[i].weight >= 1000) {
            flag = true;
            break;
          }
        }
      }
      console.log("BEN:", flag, v.beneficiaries);

      return flag;
    }
  }
};
