import "./style.css";

/*
import { setupCounter } from './counter'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
      <h1>Hello world</h1>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

*/

//IMAGE SLIDER //

const slideBtns: NodeListOf<HTMLButtonElement> =
  document.querySelectorAll("[data-slideBtn]")!;
const slideContainer = document.querySelector(
  "[data-slideContainer]"
) as HTMLDivElement;
const slides = [...[document.querySelectorAll("[data-slide]")]];

let currentIndex: number = 0;
let isMoving: boolean = false;

function handleSlideBtnClick(event: Event) {
  if (isMoving) return false;
  isMoving = true;
  //TODO: see if slider is already moving

  const currentTarget = event.currentTarget as HTMLButtonElement;

  currentTarget.id === "prev" ? currentIndex-- : currentIndex++;

  slideContainer?.dispatchEvent(new Event("sliderMove"));
}

// remove attribute function
const removeDisabledAttribute = (els: NodeListOf<HTMLButtonElement>) =>
  els.forEach((el) => el.removeAttribute("disabled"));
// add attribute function
const addDisabledAttribute = (els: Array<HTMLElement>) =>
  els.forEach((el) => el.setAttribute("disabled", "true"));

// event listerners

slideBtns.forEach((btn) => btn.addEventListener("click", handleSlideBtnClick));

slideContainer?.addEventListener("sliderMove", () => {
  // 1. translate the container to the right / left
  slideContainer.style.transform = `translateX(-${
    currentIndex * slides[0][0].clientWidth
  }px)`;

  // 2. remove disabled attributes
  removeDisabledAttribute(slideBtns);
  // 3. renable attribute if needed
  currentIndex === 0 && addDisabledAttribute([slideBtns[0]]);
});

// transition end event
slideContainer.addEventListener("transitionend", () => (isMoving = false));

// disable image drag events
const dataSlide: NodeListOf<HTMLImageElement> =
  document.querySelectorAll("[data-slide] img");

dataSlide.forEach((img) => (img.ondragstart = () => false));

// intersection observer dor slider
const sliderObserver = new IntersectionObserver(
  (slide) => {
    if (slide[0].isIntersecting) {
      addDisabledAttribute([slideBtns[1]]);
    }
  },
  { threshold: 0.75 }
);

sliderObserver.observe(slides[0][slides[0].length - 1]);

//FORM HANDLE
const contactForm = document.querySelector("#contact-form")! as HTMLFormElement;
const contactBtn = document.querySelector("#contact-btn")! as HTMLButtonElement;
const contactInput = document.querySelector("#email") as HTMLInputElement;

//fake sending email to api endpoint
function postEmailToDatabase(email: string) {
  console.log(`Your email is ${email}`);
  return new Promise((resolve) => setTimeout(resolve, 2000));
}

// options for submit button
const contactBtnOptions = {
  pending: `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="animate-spin" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><line x1="128" y1="32" x2="128" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="224" y1="128" x2="192" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="195.9" y1="195.9" x2="173.3" y2="173.3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="128" y1="224" x2="128" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="60.1" y1="195.9" x2="82.7" y2="173.3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="32" y1="128" x2="64" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="60.1" y1="60.1" x2="82.7" y2="82.7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line></svg>
            <span class="uppercase tracking-wide animate-pulse">
              Sending ...
            </span>
          `,
  success:`
          <span class="uppercase tracking-wide animate-wide">
            Thank you!
          </span>
          <span class="uppercase tracking-wide animate-wide">
            😊
          </span>
  `
};

async function handleFormSubmit(event: Event) {
  event.preventDefault();
  addDisabledAttribute([contactForm, contactBtn]);
  contactBtn.innerHTML=contactBtnOptions.pending;
  const userEmail = contactInput.value as string;
  contactInput.style.display = "none";
  await postEmailToDatabase(userEmail);
  contactBtn.innerHTML=contactBtnOptions.success;
}

// Event listern form
contactForm?.addEventListener("submit", handleFormSubmit);

// FADE UP OBSERVER

function fadeUpObserverCallback(elsToWatch:Array<IntersectionObserverEntry>){
  
  elsToWatch.forEach(els => {
    if(els.isIntersecting){
      els.target.classList.add('faded');
      fadeUpObserver.unobserve(els.target);
      els.target.addEventListener("transitionend",()=>{
          els.target.classList.remove('fade-up','faded');
      })
    };
  })
}

const fadeObserverOptions = {
  threshold:.6
}

const fadeUpObserver = new IntersectionObserver(fadeUpObserverCallback,fadeObserverOptions);

document.querySelectorAll('.fade-up').forEach(item=>{
    fadeUpObserver.observe(item)
})
