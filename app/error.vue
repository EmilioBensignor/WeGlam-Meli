<template>
    <div class="min-h-screen flex flex-col bg-surface-base">
        <AuthHeader />
        <DefaultMain>
            <DefaultSection class="gap-9!">
                <HeadingH1>Página no encontrada</HeadingH1>
                <p class="max-w-135 text-xl font-light text-on-surface-variant">
                    Parece que has tomado un desvío inesperado. La página que buscas no está disponible o ha cambiado de
                    dirección.
                </p>
                <ButtonPrimary :to="ROUTE_NAMES.HOME">Volver al inicio</ButtonPrimary>
            </DefaultSection>
        </DefaultMain>
        <DefaultFooter />
    </div>
</template>

<script setup>
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES'
</script>