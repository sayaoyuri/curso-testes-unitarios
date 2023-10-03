import { generateProtocolForPacient } from "protocols-generator";

jest.mock('uuid', () => {
  return {
    v4: () => { return 'Protocolo gerado pelo mock' }
  }
})

describe("Pacient", () => {
  it("should work", async () => {
    const protocol = generateProtocolForPacient('José', 'Antunes', true);

    expect(protocol).toEqual({
      priority: true,
      date: expect.any(Date),
      pacient: 'José Antunes',
      protocol: 'Protocolo gerado pelo mock'
    });
  });
});