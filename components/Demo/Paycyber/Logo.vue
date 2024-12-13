<template lang="pug">
.demo-paycyber-logo(:class="classes")
  .demo-paycyber-logo__logo
    .demo-paycyber-logo__line-first
      .demo-paycyber-logo__pay
        | PAY
      .demo-paycyber-logo__cyber
        | CYBER
    .demo-paycyber-logo__line-sep
    .demo-paycyber-logo__line-second
      .demo-paycyber-logo__sdd
        | {{ subtitle }}
</template>

<script>
export default {

  props: ['subtitle', 'show', 'alt', 'glitch'],

  computed: {

    classes() {
      const classes = [];

      if (this.show) classes.push('show');
      if (this.alt) classes.push('alt');
      if (this.glitch) classes.push('glitch');
      return classes.map(v => 'demo-paycyber-logo--' + v);
    },

  },


}
</script>

<style lang="sass">
.demo-paycyber-logo
  width: 100%
  height: 100%
  overflow: hidden
  position: relative

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
    text-shadow: .2vw .2vw #4bbbe1, .2vw .2vw 1vw white
    margin-right: 2vw
    letter-spacing: .5vw

  &__cyber
    font: var(--font--cyber)
    font-size: 13vw
    color: #ffef02
    text-shadow: .2vw .2vw #4bbbe1, .2vw .2vw 1vw white

  &__line-sep
    background: url('/media/demo/paycyber/assets/horizontalRule.svg') no-repeat center center
    filter: drop-shadow(0 0 2vw #ffef02)
    animation: demo-paycyber-logo__drop-color 5s infinite alternate linear

  &__sdd
    --demo-paycyber-logo--color: #ed1f24
    --demo-paycyber-logo--color-shadow: red
    --demo-paycyber-logo--color-shadow-glitch: #ff000240
    font: var(--font--sdd)
    font-size: 10vw
    color: var(--demo-paycyber-logo--color)
    text-shadow: .2vw .2vw 1vw var(--demo-paycyber-logo--color-shadow)
    transform-origin: center
    animation: demo-paycyber-logo__show-animation 20s infinite alternate
  
  &--alt &__sdd
    --demo-paycyber-logo--color: #4bbbe1
    --demo-paycyber-logo--color-shadow: white
    --demo-paycyber-logo--color-shadow-glitch: #ffef0240

  &--glitch &__sdd
    animation: demo-paycyber-logo__show-glitch-animation 20s forwards, demo-paycyber-logo__subtitle-glitch 2s infinite steps(1)

  &--glitch &__pay,
  &--glitch &__cyber
    animation: demo-paycyber-logo__font-animation 20s forwards

@keyframes demo-paycyber-logo__show-animation
  0%, 5%
    transform: scale(3)
    opacity: 0
  10%, 100%
    opacity: 1
    transform: scale(1)

@keyframes demo-paycyber-logo__drop-color
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

@keyframes demo-paycyber-logo__background-change
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

@keyframes demo-paycyber-logo__subtitle-glitch
  0%, 13%, 23%, 33%, 43%, 53%, 63%, 73%, 83%, 93%, 100%
    text-shadow: .2vw .2vw 1vw red
  10%
    text-shadow: .2vw .2vw 1vw red, -2vw 3vw var(--demo-paycyber-logo--color-shadow-glitch)
  20%
    text-shadow: .2vw .2vw 1vw red, 1vw 5vw var(--demo-paycyber-logo--color-shadow-glitch), 4vw -3vw var(--demo-paycyber-logo--color-shadow-glitch)
  30%
    text-shadow: .2vw .2vw 1vw red, 2vw -1vw var(--demo-paycyber-logo--color-shadow-glitch), -5vw 3vw var(--demo-paycyber-logo--color-shadow-glitch)
  40%
    text-shadow: .2vw .2vw 1vw red, -4vw -2vw var(--demo-paycyber-logo--color-shadow-glitch), 3vw 5vw var(--demo-paycyber-logo--color-shadow-glitch)
  50%
    text-shadow: .2vw .2vw 1vw red, 5vw -5vw var(--demo-paycyber-logo--color-shadow-glitch), -3vw 2vw var(--demo-paycyber-logo--color-shadow-glitch)
  60%
    text-shadow: .2vw .2vw 1vw red, -2vw 3vw var(--demo-paycyber-logo--color-shadow-glitch), 1vw -2vw var(--demo-paycyber-logo--color-shadow-glitch)
  70%
    text-shadow: .2vw .2vw 1vw red, 3vw 3vw var(--demo-paycyber-logo--color-shadow-glitch), -5vw 1vw var(--demo-paycyber-logo--color-shadow-glitch)
  80%
    text-shadow: .2vw .2vw 1vw red, 1vw -3vw var(--demo-paycyber-logo--color-shadow-glitch), -2vw -4vw var(--demo-paycyber-logo--color-shadow-glitch)
  90%
    text-shadow: .2vw .2vw 1vw red, 5vw -2vw var(--demo-paycyber-logo--color-shadow-glitch), -4vw 1vw var(--demo-paycyber-logo--color-shadow-glitch)

@keyframes demo-paycyber-logo__font-animation
  0%, 10%
    color: #ffef02
    text-shadow: .2vw .2vw #4bbbe1, .2vw .2vw 1vw white
  20%
    color: #ed1f24
    text-shadow: .2vw .2vw red, .2vw .2vw 1vw red
  30%, 100%
    color: #ed1f24
    text-shadow: .2vw .2vw red, .2vw .2vw 1vw red, .2vw .2vw 1vw red, .2vw .2vw 2vw red

@keyframes demo-paycyber-logo__show-glitch-animation
  0%, 10%
    transform: scale(3)
    opacity: 0
  15%, 100%
    opacity: 1
    transform: scale(1)
  
</style>