<template>
    <div class="category-admin">
        <b-form>
            <input id="id" type="hidden" v-model="category.id" />
            <b-row>
                <b-col sm="12">
                    <b-form-group label="Descrição:" label-for="category-name">
                        <b-form-input id="category-name" type="text"
                            v-model="category.name" required
                            :readonly="mode==='remove'"
                            placeholder="Descrição da Categoria..." />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row v-if="mode === 'save'">
                <b-col sm="12">
                    <b-form-group label="Categoria Pai:" label-for="category-parent">
                        <b-form-select :readonly="mode==='remove'" id="category-parent" v-model="category.parentId" :options="comboCategories" />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col xs="12">
                    <b-button variant="primary" v-if="mode ==='save'"
                        @click="save">Salvar</b-button>
                    <b-button variant="danger" v-if="mode ==='remove'"
                        @click="remove">Excluir</b-button>
                    <b-button class="ml-2" 
                        @click="reset">Cancelar</b-button>
                </b-col>
            </b-row>
        </b-form>
        <b-table class="mt-2" hover striped :items="categories" :fields="fields">
            <template slot="actions" slot-scope="data">
                <b-button variant="warning" @click="loadCategory(data.item)" class="mr-2">
                    <i class="fa fa-pencil" />
                </b-button>
                <b-button variant="danger" @click="loadCategory(data.item, 'remove')">
                    <i class="fa fa-trash" />
                </b-button>
            </template>
        </b-table>
    </div>
</template>

<script>

import axios from "axios"
import {baseApiUrl, showError} from "@/global"

export default {
    name: "CategoryAdmin",
    data: function() {
        return {
            mode: "save",
            comboCategories: [],
            category: {},
            categories: [],
            fields: [
                {key: "id", label: "Código", sortable: true},
                {key: "name", label: "Descrição", sortable: true},
                {key: "path", label: "Caminho", sortable: true},
                {key: "actions", label: "Ações"},
            ]
        }
    },
    methods: {
        loadCategories() {
            const url = `${baseApiUrl}/categories`
            axios.get(url).then(res => {
                this.categories = res.data
                this.loadComboCategories()
            })
        },
        save(){
            const method = this.category.id ? "put" : "post"
            const id = this.category.id ? `/${this.category.id}` : ""
            axios[method](`${baseApiUrl}/categories${id}`, this.category)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        remove(){
            const id = this.category.id
            axios.delete(`${baseApiUrl}/categories/${id}`, this.category)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        reset(){
            this.mode = "save"
            this.category = {}
            this.loadCategories()
        },
        loadCategory(category, mode = "save"){
            this.mode = mode
            this.category = {...category}
            delete this.category.path
        },
        loadComboCategories(){
            this.comboCategories = []
            let categ = {}
            this.categories.map(e => {
                categ = {}
                categ.value = e.id
                categ.text = e.path
                this.comboCategories.push(categ)
            })
        }
    },
    mounted() {
        this.loadCategories()
    }
}
</script>

<style>

</style>
