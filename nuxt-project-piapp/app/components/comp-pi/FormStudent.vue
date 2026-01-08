<script setup lang="ts">
interface StudentData {
    nom: string;
    cognoms: string;
    ralc: string;
    dni: string;
    dataNaixement: string;
    curs: string;
    grup: string;
}

const props = defineProps<{
    modelValue: StudentData;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: StudentData): void;
}>();

const updateField = (field: keyof StudentData, value: string) => {
    emit('update:modelValue', { ...props.modelValue, [field]: value });
};
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-white shadow-sm">
        <h3 class="col-span-1 md:col-span-2 text-lg font-semibold mb-2">Dades de l'Alumne</h3>

        <div class="form-group">
            <label class="block text-sm font-medium text-gray-700">Nom</label>
            <UInput :model-value="modelValue.nom" @update:model-value="val => updateField('nom', val)" placeholder="Nom" />
        </div>

        <div class="form-group">
            <label class="block text-sm font-medium text-gray-700">Cognoms</label>
            <UInput :model-value="modelValue.cognoms" @update:model-value="val => updateField('cognoms', val)" placeholder="Cognoms" />
        </div>

        <div class="form-group">
            <label class="block text-sm font-medium text-gray-700">RALC</label>
            <UInput :model-value="modelValue.ralc" @update:model-value="val => updateField('ralc', val)" placeholder="RALC" />
        </div>

        <div class="form-group">
            <label class="block text-sm font-medium text-gray-700">DNI / TIE</label>
            <UInput :model-value="modelValue.dni" @update:model-value="val => updateField('dni', val)" placeholder="DNI" />
        </div>

         <div class="form-group">
            <label class="block text-sm font-medium text-gray-700">Data Naixement</label>
            <UInput type="date" :model-value="modelValue.dataNaixement" @update:model-value="val => updateField('dataNaixement', val)" />
        </div>

        <div class="form-group">
            <label class="block text-sm font-medium text-gray-700">Curs</label>
            <UInput :model-value="modelValue.curs" @update:model-value="val => updateField('curs', val)" placeholder="Ex: 3r ESO" />
        </div>

        <div class="form-group">
            <label class="block text-sm font-medium text-gray-700">Grup</label>
             <UInput :model-value="modelValue.grup" @update:model-value="val => updateField('grup', val)" placeholder="Ex: A" />
        </div>
    </div>
</template>
