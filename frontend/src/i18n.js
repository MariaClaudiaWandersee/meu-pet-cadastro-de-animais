import { createI18n } from 'vue-i18n'

const messages = {
   en: {
          login: "Login",
          email: "Email",
          password: "Password",
          logout: "Logout",
          loginError:"An unexpected error occurred",

          name: "Name",
          sex: "Sex",
          age: "Age",
          animalType: "Animal Type",
          male: "Male",
          female: "Female",
          dog: "Dog",
          cat: "Cat",
          vaccines: "Vaccines",
          hasRestrictions: "Has restrictions?",
          yes: "Yes",
          no: "No",
          restricion: "Restriction",
          image: "Image",
          imageTooltip: "Only one image per registration",
          uploadImage: "Upload Image",
          vaccineV8V10: "V8/V10",
          vaccineV4V5: "V4/V5",
          vaccineFelv: "FeLV",
          vaccineAntirrabica: "Rabies",
          true: "Yes",
          false: "No",
          errorAddingAnimal: "Error adding animal",
          sucessAddingAnimal: "Animal successfully added!",

          noAnimals: "No animals found",
          confirmDeletion: "Confirm deletion",
          deleteText: "Yes, delete",
          cancelText: "Cancel",
          modalTextDelete: "Are you sure you want to delete this registration?",
          errorDeletingAnimal: "Error deleting animal",
          sucessDeletingAnimal: "Animal successfully removed!",

          confirmDeletionKey: "To confirm the deletion, type below:",
          enterCodeAbove: "Enter the code above",
          codeMismatch: "The code entered does not match!",

          addUser: "Add User",
          role: "Role",
          admin: "Admin",
          attendant: "Attendant",
          errorAddUser: "Error adding user",
          sucessAddUser: "User successfully added!",

          deleteUser: "Are you sure you want to delete",

          editAnimal: "Edit Animal",
          animalUpdated: "Animal successfully updated!",
          errorupdateAnimal: "Error updating animal",

          editUser: "Edit User",
          errorUpdateUser: "Error updating user",
          sucessUpdateUser: "User successfully updated!",

          filterText: "Filter by name...",
          animal: "Animal",
          user: "User",

          registeredAnimals: "Registered Animals",
          registeredUsers: "Registered Users",
          logout: "Logout",

          emailCopied: "Email copied!",
          actions: "Actions",

          errorLogout: "Error during logout",
          sucessDeletingUser: "User successfully removed!",
          errorDeletingItem: "Error deleting item",

          addAnimal: "Add Animal",

          reset: "Reset",
          okText: "Ok",
          

  },
  pt: {
          login: "Entrar",
          email: "Email",
          password: "Senha",
          logout: "Sair",
          loginError:"Ocorreu um erro inesperado",

          name: "Nome",
          sex: "Sexo",
          age: "Idade",
          animalType: "Tipo de Animal",
          male: "Macho",
          female: "Fêmea",
          dog: "Cachorro",
          cat: "Gato",
          vaccines: "Vacinas",
          hasRestrictions: "Possui restrições?",
          yes: "Sim",
          no: "Não",
          restricion: "Restrição",
          image: "Imagem",
          imageTooltip: "Apenas uma imagem por cadastro",
          uploadImage: "Carregar Imagem",
          vaccineV8V10: "V8/V10",
          vaccineV4V5: "V4/V5",
          vaccineFelv: "FeLV",
          vaccineAntirrabica: "Antirrábica",
          true: "Sim",
          false: "Não",
          errorAddingAnimal: "Erro ao adicionar animal",
          sucessAddingAnimal: "Animal adicionado com sucesso!",

          noAnimals: "Nenhum animal encontrado",
          confirmDeletion: "Confirmar exclusão",
          deleteText: "Sim, excluir",
          cancelText: "Cancelar",
          modalTextDelete: "Tem certeza de que deseja excluir este cadastro?",
          errorDeletingAnimal: "Erro ao excluir animal",
          sucessDeletingAnimal: "Animal removido com sucesso!",

          confirmDeletionKey: "Para confirmar a exclusão, digite abaixo:",
          enterCodeAbove: "Digite o código acima",
          codeMismatch: "O código digitado não corresponde!",

          addUser: "Adicionar Usuário",
          role: "Função",
          admin: "Admin",
          attendant: "Atendente",
          errorAddUser: "Erro ao adicionar usuário",
          sucessAddUser: "Usuário adicionado com sucesso!",

          deleteUser: "Tem certeza de que deseja excluir",

          editAnimal: "Editar Animal",
          animalUpdated: "Animal atualizado com sucesso!",
          errorupdateAnimal: "Erro ao atualizar animal",

          editUser: "Editar Usuário",
          errorUpdateUser: "Error ao atualizar usuário",
          sucessUpdateUser: "Usuário atualizado com sucesso!",

          filterText: "Filtro por nome...",
          animal: "Animal",
          user: "Usuário",

          registeredAnimals: "Animais Registrados",
          registeredUsers: "Usuários Registrados",
          logout: "Sair",

          emailCopied: "Email copiado!",
          actions: "Ações",

          errorLogout: "Erro ao sair",
          sucessDeletingUser: "Usuário removido com sucesso!",
          errorDeletingItem: "Erro ao excluir item",

          addAnimal: "Adicionar Animal",

          reset: "Limpar",
          okText: "Ok",
  }
}

export const i18n = createI18n({
  locale: 'pt',
  fallbackLocale: 'en',
  messages,
})
