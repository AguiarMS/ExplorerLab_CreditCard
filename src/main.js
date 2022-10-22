import "./css/index.css"
import IMask, { MaskedRange } from "imask"

// Acessando o local do path background da imagem
const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")

const ccBgColor02 = document.querySelector(".cc-bg svg g g:nth-child(2) path")

// Acessando o local do path da SVG do logo
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

//Estrutura de dados para as cores setadas

function setCardTypes(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    apple: ["#800080", "#FFC8C8"],
    default: ["black", "gray"],
  }

  //Mudando o atributo com setAttribute
  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])

  //ccLogo altera a imagem da bandeira do cartão
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}
// Security Code CVC
const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

//#expiration-date
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },

    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
}

const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPatter = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },

    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },

    {
      mask: "0000 0000 0000 0000",
      regex: /(^7[1-7]\d{0,2}|^30[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "apple",
    },

    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    return foundMask
  },
}

const cardNumberMasked = IMask(cardNumber, cardNumberPatter)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  console.log("object")
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerText =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

// Usando a mask do CVC no input para aparecer no cartão
const getSecurityCode = securityCodeMasked.on("accept", () => {
  getSecurityCodeMasked(getSecurityCode.value)
})

function getSecurityCodeMasked(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length === 0 ? "1234" : code
}

// Pegando os valores do input de numero do cartão e exibindo no card conforme a bandeira
const getCardNumberMasked = cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardTypes(cardType)
  UpdateCardNumberMasked(getCardNumberMasked.value)
})

function UpdateCardNumberMasked(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "0000 0000 0000 0000" : number
}

// Pegando os valores do input data de expiração
const getExpirationDateMasked = expirationDateMasked.on("accept", () => {
  UpdateExpirationDateMasked(getExpirationDateMasked.value)
})

function UpdateExpirationDateMasked(expirate) {
  const ccExpiration = document.querySelector(".cc-expiration .value")
  ccExpiration.innerText = expirate.length === 0 ? "0000" : expirate
}
