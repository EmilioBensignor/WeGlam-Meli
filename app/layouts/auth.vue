<template>
  <div class="min-h-screen flex flex-col bg-surface-base">
    <AuthHeader />
    <DefaultMain>
      <slot />
    </DefaultMain>
    <DefaultFooter />
  </div>
</template>