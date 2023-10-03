import * as usersRepository  from '../../src/users-repository';
import * as infractionsService  from '../../src/infractions-service';
import * as infractionsRepository  from '../../src/infractions-repository';
import { generateInfraction, generateUserWithNInfractions } from '../integration/factories/user-infractions-factory';

describe("Infractions Service Tests", () => {
  it("should get infractions from user", async () => {
    const userWithInfractions = await generateUserWithNInfractions();
    jest.spyOn(usersRepository, 'getUserByDocument').mockImplementationOnce((): any => {
      return { ...userWithInfractions };
    });

    const infractionsSpy = await generateInfraction(userWithInfractions.id);
    jest.spyOn(infractionsRepository, 'getInfractionsFrom').mockImplementationOnce((): any => {
      return infractionsSpy
    });

    const infractions = await infractionsService.getInfractionsFrom(userWithInfractions.licenseId);
    expect(infractions).toEqual({
      ...userWithInfractions,
      infractions: infractionsSpy
    });
  });

  it("should throw an error when driver license does not exists", async () => {
    jest.spyOn(usersRepository ,'getUserByDocument').mockImplementationOnce((): any => {
      return undefined;
    });

    const result = infractionsService.getInfractionsFrom('1234');
    expect(result).rejects.toEqual({
      type: "NOT_FOUND",
      message: "Driver not found."
    });
  })
});