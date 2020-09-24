import { Request, Response, NextFunction } from 'express'
import db from '../database/connection'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mailer from '../modules/mailer'

export default class LoginController {
    async index(request: Request, response: Response) {
        const { email, password } = request.headers

            const digitPassword = password as string

            const user = await db('login')
            .whereExists(function() {
                this.select('login.*')
                .from('login')
            }).where({email})

            if (!user) {
                return response.send(401).json({ error: 'Unauthorized, datas not find' })
            } else if (!password || !email) {
                return response.json({error: 'Unauthorized, datas not find'}).sendStatus(401)
            }

            const userData = user[0]

            const isValidPassword = await bcrypt.compare(digitPassword, userData.password)

            if (!isValidPassword) {
                return response.sendStatus(401).json({ error: 'Your password not is valid'})
            }

            const token = jwt.sign({ id: userData.id }, `8`, { expiresIn: '1d' })

            delete userData.password
            delete userData.token

        return response.json({
            user,
            token
        })
    }

    async create(request: Request, response: Response) {
        const {
            name,
            subName,
            email,
            password
        } = request.body

        const passCrypt = await bcrypt.hash(password, 8)
        const trx = await db.transaction()
    
       try {
        const insertedUsersIds = await trx('login').insert({
            name,
            subName,
            email,
            password: passCrypt,
            
        })
        
        await trx.commit()
    
        return response.status(201).send()
    
       } catch (err) {
        console.log(err)

        await trx.rollback()
    
           return response.status(400).json({
               error: 'Unexpected error while creating new class'
           })
       }
    }

    async forgot(request: Request, response: Response) {
        const { email } = request.body
        const trx = await db.transaction()

            const user = await trx('login')
            .whereExists(function() {
                this.select('login.*')
                .from('login')
            }).where({email})

            if (!user) {
                return response.send(401).json({ error: 'Unauthorized, datas not find' })
            } else if (!email) {
                return response.json({error: 'Unauthorized, datas not find'}).sendStatus(401)
            }

            const userData = user[0]

            
            const token = await jwt.sign({ id: userData.id }, `8`, { expiresIn: '1h' })

            mailer.sendMail({
                to: email,
                from: 'proffy.nlw@zohomail.com',
                subject: 'Proffy: Esqueceu sua senha?',
                text: `Olá, esqueceu sua senha? Não se preocupe, use esse token`,
                html: `<h3>Olá, esqueceu sua senha? Não se preocupe, use este token: <br/> <span style="color:#609">${token}</span></h3>`,
            }), (err: Error) => {
                if (err) {
                    return response.status(400).send({ error: 'Cannot send forgot password email' })
                }
                return response.send()
            }
            
            try {
                const insertToken = await trx('login').update({
                    token: token
                }).where('id', '=', userData.id)

                await trx.commit()
    
                delete userData.password
    
            return response.json({
                user,
            })

            } catch (err) {
                console.log(err)
        
                await trx.rollback()
            
                   return response.status(400).json({
                       error: 'Unexpected error while creating new class'
                   })
               }

            
    }

    async reset(request: Request, response: Response) {
        const { email, token, password } = request.body
        const trx = await db.transaction()

        const passwordValue = password as string

        const user = await trx('login')
        .whereExists(function() {
            this.select('login.*')
            .from('login')
        }).where({email})

        if (!user) {
            return response.send(401).json({ error: 'Unauthorized, datas not find' })
        } else if (!email) {
            return response.json({error: 'Unauthorized, datas not find'}).sendStatus(401)
        }

        const userData = user[0]
        const passCrypt = await bcrypt.hash(passwordValue, 8)

        if (token !== userData.token) {
            return response.status(400).send({ error: 'Token invalid' })
        } else {
            try {
                const insertPassword = await trx('login').update({
                    password: passCrypt
                }).where('id', '=', userData.id)

                await trx.commit()
    
            return response.send()

            } catch (err) {
                console.log(err)
        
                await trx.rollback()
            
                   return response.status(400).json({
                       error: 'Unexpected error while creating new class'
                   })
               }
        }
 
    }

}