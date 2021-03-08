const gantt = require("dhtmlx-gantt").gantt;

class StartToFinishTask {
  moveRight() {}

  newStartDate(predecessor) {
    return gantt.calculateEndDate({
      start_date: predecessor.start_date,
      duration: predecessor.duration,
    });
  }

  nextStartDate(successor, leadLag = 0) {
    return gantt.calculateEndDate({
      start_date: successor.start_date,
      duration: leadLag,
    });
  }
}

describe("#moveSuccesor", () => {});

describe("FINISH TO START 0", () => {
  it("should calculate the next start date for a succesor", () => {
    const predecessor = {
      start_date: new Date("2021/01/26"),
      duration: 1,
    };

    const successor = {
      start_date: new Date("2021/01/26"),
      duration: 1,
    };

    const subject = new StartToFinishTask();
    const newDate = formatDate(subject.newStartDate(predecessor));

    expect(newDate).toEqual("2021/01/27");
  });
});

describe("with lead/lag", () => {
  it("moving predecessor on successor", () => {
    const predecessor = {
      start_date: new Date("2021/01/26"),
      duration: 1,
    };

    const successor = {
      start_date: new Date("2021/01/27"),
      duration: 1,
    };

    const leadLag = 1;

    const subject = new StartToFinishTask();
    const newDate = formatDate(subject.newStartDate(successor, leadLag));

    expect(newDate).toEqual("2021/01/28");
  });

  it("when the successor has a negative lead lag", () => {
    const predecessor = {
      start_date: new Date("2021/01/29"),
      duration: 1,
    };

    const successor = {
      start_date: new Date("2021/01/29"),
      duration: 1,
    };

    const leadLag = -1;

    const subject = new StartToFinishTask();
    const newDate = formatDate(subject.newStartDate(predecessor, leadLag));

    expect(newDate).toEqual("2021/01/29");
  });

  describe("link with succesor with a future start date", () => {
    it("given a link with successo", () => {
      const predecessor = {
        start_date: new Date("2021/01/23"),
        duration: 1,
      };

      const successor = {
        start_date: new Date("2021/01/29"),
        duration: 1,
      };

      const link = {
        predecessor,
        successor,
        leadLag: 1,
      };

      const subject = new StartToFinishTask();
      const newDate = formatDate(
        subject.nextStartDate(predecessor, successor, link.leadLag)
      );

      expect(newDate).toEqual("2021/01/29");
    });
  });
});

function formatDate(date) {
  if (!date) {
    throw new Error("Undefined Date");
  }

  const day = date.getDate();
  const formattedDay = day < 10 ? `0${day}` : day;
  const month =
    date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  return `${date.getFullYear()}/${month}/${formattedDay}`;
}
