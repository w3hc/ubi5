import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { expect } from "chai"
import { ethers } from "hardhat"

describe("UBI5", function () {
    async function deployContracts() {
        let [owner, alice, bob, francis] = await ethers.getSigners()

        const EURMock = await ethers.getContractFactory("EURMock")
        const eur = await EURMock.deploy(ethers.parseEther("10000000"))

        const UBI5 = await ethers.getContractFactory("UBI5")
        const ubi5 = await UBI5.deploy(await eur.getAddress(), owner.address)

        return { ubi5, owner, eur, alice, bob, francis }
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { ubi5, owner } = await loadFixture(deployContracts)
            expect(await ubi5.owner()).to.equal(owner.address)
        })
    })

    describe("Interactions", function () {
        it("Should add a beneficiary", async function () {
            const { ubi5, eur } = await loadFixture(deployContracts)
            const input = ethers.parseEther("10000")
            await eur.transfer(await ubi5.getAddress(), input)
            expect(await eur.balanceOf(await ubi5.getAddress())).to.be.equal(
                ethers.parseEther("10000")
            )
        })

        it("Should distribute the UBI", async function () {
            const { ubi5, eur, alice, francis } = await loadFixture(
                deployContracts
            )

            // Someone transfers 10k EUR to the contract
            const input = ethers.parseEther("10000")
            await eur.transfer(await ubi5.getAddress(), input)
            // await eur.approve(ubi5.address, input)
            expect(await eur.balanceOf(await ubi5.getAddress())).to.be.equal(
                ethers.parseEther("10000")
            )

            // Alice becomes a beneficiary
            await ubi5.addBeneficiary(alice.address)
            expect((await ubi5.beneficiaries(0)).status).to.be.equal(2)

            // Francis calls the distribute function
            await ubi5.connect(francis).distribute()
            expect(await eur.balanceOf(await ubi5.getAddress())).to.be.equal(
                ethers.parseEther("8000")
            )
            expect(await eur.balanceOf(alice.address)).to.be.equal(
                ethers.parseEther("2000")
            )
        })
    })
})
