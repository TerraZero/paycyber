<template lang="pug">
.page-test-font
  .page-test-font__background
  h2.page-test-font__payday-test
    | Payday Test
  h2.page-test-font__cyber-test
    | Cyberpunk Test
  h2.page-test-font__sdd-test
    | Cyber Spire Test

  .page-test-font__logo
    .page-test-font__line-first
      .page-test-font__pay
        | PAY
      .page-test-font__cyber
        | CYBER
    .page-test-font__line-sep
    .page-test-font__line-second
      .page-test-font__sdd
        | Cyber Spire

</template>

<script>
export default {
  data() {
    return {
      
    };
  },
}
</script>

<style lang="sass">
.page-test-font
  width: 100vw
  height: 100vh
  overflow: hidden
  position: relative

  &__background
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background: url('https://cdn.midjourney.com/61b8d72b-05ea-4b20-8bf1-d86e2e53bf5a/0_0.png')
    background-size: cover
    background-position: top center
    opacity: .5
    filter: contrast(200%) saturate(200%) brightness(150%) blur(0px) grayscale(30%)
    animation: page-test-font__background-change 15s infinite alternate linear

  &__payday-test
    font: var(--font--pay)

  &__cyber-test
    font: var(--font--cyber)

  &__sdd-test
    font: var(--font--sdd)

  &__logo
    position: absolute
    top: 50%
    left: 0
    width: 100%
    transform: translateY(-50%)
    display: grid
    grid-template-rows: 1fr 3vh 1fr
    text-align: center

  &__line-first
    display: flex
    justify-content: center

  &__pay
    font: var(--font--pay)
    font-size: 13vw
    color: #ffef02
    text-shadow: .2vw .2vw #4bbbe1
    margin-right: 2vw

  &__cyber
    font: var(--font--cyber)
    font-size: 13vw
    color: #ffef02
    text-shadow: .2vw .2vw #4bbbe1

  &__line-sep
    background: url('/cyber/horizontalRule.svg') no-repeat center center
    filter: drop-shadow(0 0 2vw #ffef02)
    animation: page-test-font__drop-color 5s infinite alternate linear

  &__sdd
    font: var(--font--sdd)
    font-size: 10vw
    color: #4bbbe1
    text-shadow: .2vw .2vw #ffef02


@keyframes page-test-font__drop-color
  0% 
    filter: drop-shadow(0 0 2vw #ffef02)
  20%
    filter: drop-shadow(0 0 3vw #4bbbe1)
  40%
    filter: drop-shadow(0 0 2vw #ffef02)
  60%
    filter: drop-shadow(0 0 1vw #4bbbe1)
  80%
    filter: drop-shadow(0 0 2vw #ffef02)
  100%
    filter: drop-shadow(0 0 3vw #4bbbe1)

@keyframes page-test-font__background-change
  0% 
    filter: contrast(200%) saturate(200%) brightness(150%) blur(0px) grayscale(30%)
  20%
    filter: contrast(150%) saturate(200%) brightness(250%) blur(1px) grayscale(30%)
  40%
    filter: contrast(170%) saturate(150%) brightness(150%) blur(0px) grayscale(30%)
  60%
    filter: contrast(200%) saturate(250%) brightness(170%) blur(1px) grayscale(30%)
  80%
    filter: contrast(170%) saturate(150%) brightness(200%) blur(0px) grayscale(30%)
  100%
    filter: contrast(150%) saturate(170%) brightness(110%) blur(0px) grayscale(50%)

</style>