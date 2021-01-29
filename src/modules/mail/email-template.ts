export function emailTemplateReset (hash: string) {
  return `
ВОССТАНОВЛЕНИЕ ДОСТУПА К СИСТЕМЕ

Забыли пароль от личного кабинета? Не проблема, исправим! Перейдите по ссылке ниже и выполните указанные инструкции.

https://cabinet.gohappy.team/password-reset?resetPasswordHash=${hash}

Важно!
Если вы не пытались сбросись пароль на сайте gohappy.team, пожалуйста, проигнорируйте это письмо!

С уважением, команда GoHappy
  `
}
