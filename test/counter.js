const Counter = artifacts.require('Counter');

contract('Counter', accounts => {
  it('should not recognise new accounts in collaborators', async() => {
    const counter = await Counter.deployed();
    for (let i = 0; i < accounts.length; i++) {
      expect(await counter.hasCollaborated({from: accounts[0]})).to.be.false;
    }
  });

  it('should initialise with zero count', async() => {
    const counter = await Counter.deployed();
    expect((await counter.get()).toNumber()).to.equal(0);
  });

  const increaseAll = async(counter, get) => {
    const increaseCounts = [2, 0, 1, 0, 1, 2, 3, 1, 1, 0];
    if (increaseCounts.length > accounts.length) {
      increaseCounts.splice(accounts.length);
    } else if (increaseCounts.length < accounts.length) {
      for (let i = increaseCounts.length; i < accounts.length; i++) {
        increaseCounts.push(0);
      }
    }

    for (let i = 0; i < increaseCounts.length; i++) {
      for (let j = 0; j < increaseCounts[i]; j++) {
        await counter.increase({from: accounts[i]});
      }
    }

    if (get === 'sum') {
      return increaseCounts.reduce((sum, x) => sum + x, 0);
    } else if (get === 'collaborators') {
      return increaseCounts.map(x => x > 0);
    }
    return null;
  };

  it('should increase correctly', async() => {
    const counter = await Counter.deployed();
    const sum = await increaseAll(counter, 'sum');
    expect((await counter.get()).toNumber()).to.equal(sum);
  });

  it('should mark collaborators correctly', async() => {
    const counter = await Counter.deployed();
    const collaborators = await increaseAll(counter, 'collaborators');
    for (let i = 0; i < accounts.length; i++) {
      if (collaborators[i]) {
        expect(await counter.hasCollaborated({from: accounts[i]})).to.be.true;
      } else {
        expect(await counter.hasCollaborated({from: accounts[i]})).to.be.false;
      }
    }
  });
});
