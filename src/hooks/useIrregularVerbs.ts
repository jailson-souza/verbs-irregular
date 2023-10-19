"use client"

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useMemo, useState } from "react";
import irregular_verbs from '@verbs/data/irregular_verbs.json'


type ToZodObjectSchema<Type> = {
    [Property in keyof Type]?: z.ZodTypeAny
}

type TIrregularVerb = {
    id?: string
    verb: string
    infinitive: string
    simplePast: string
    pastParticiple: string
}

type IrregularVerbForm = TIrregularVerb & {
    INFINITIVE: string
    SIMPLE_PAST: string
    PAST_PARTICIPLE: string
}

const compareProps = (prop1: string | unknown, prop2: string | unknown) => String(prop1).toLowerCase() === String(prop2).toLowerCase()

const irregularVerbSchema = z.object<ToZodObjectSchema<IrregularVerbForm>>({
    id: z.string(),
    verb: z.string(),
    infinitive: z.string().min(1, 'required'),
    simplePast: z.string().min(1, 'required'),
    pastParticiple: z.string().min(1, 'required'),
    INFINITIVE: z.string(),
    SIMPLE_PAST: z.string(),
    PAST_PARTICIPLE: z.string()
})
.refine(({ infinitive, INFINITIVE }) => compareProps(infinitive, INFINITIVE), (arg) => ({ path: ['infinitive'], message: String(arg.INFINITIVE) }))
.refine(({ simplePast, SIMPLE_PAST }) => compareProps(simplePast, SIMPLE_PAST), (arg) => ({ path: ['simplePast'], message: String(arg.SIMPLE_PAST) }))
.refine(({ pastParticiple, PAST_PARTICIPLE }) => compareProps(pastParticiple, PAST_PARTICIPLE), (arg) => ({ path: ['pastParticiple'], message: String(arg.PAST_PARTICIPLE) }))

export default function useIrregularVerbs(){
    const {
        control,
        formState,
        reset,
        setValue,
        getValues,
    } = useForm<IrregularVerbForm>({
        mode: 'onTouched',
        resolver: zodResolver(irregularVerbSchema),
        defaultValues: {
            id: "",
            verb:"",
            infinitive:"",
            simplePast: "",
            pastParticiple: "",
            INFINITIVE: "",
            SIMPLE_PAST: "",
            PAST_PARTICIPLE: "",
        }
    })

    const [currentVerbIndex, setCurrentVerbIndex] = useState(0)
    const [ filledVerbs, setFilledVerbs ] = useState<IrregularVerbForm[]>([])

    const showNextButton = useMemo(() => currentVerbIndex < irregular_verbs?.length && formState.isValid, [currentVerbIndex, formState.isValid])
    const showPreviewButton = useMemo(() => currentVerbIndex > 0, [currentVerbIndex])


    const handlePreviewVerb = useCallback(() => {
        setCurrentVerbIndex(index => index > 0 ? index - 1 : index)
    }, [])

    const handleNextVerb  = useCallback(() => {
        if(formState.isValid){
            setFilledVerbs(([ ...filledVerbs ]) => {
                const currentVerb = getValues()
                if(!filledVerbs?.some(verb => verb.id === currentVerb.id )){
                    filledVerbs.push(currentVerb) 
                }
                return filledVerbs
            })
            setCurrentVerbIndex(index => index < irregular_verbs.length ? index + 1 : index)
        }
    }, [formState.isValid, getValues])

    useEffect(() => {
        console.log('aqui')
        const verb = irregular_verbs[currentVerbIndex]
        const filledVerb = filledVerbs?.find(({ id }) => id === verb?.id)

        if(filledVerb){
            reset({ ...filledVerb })
        } else if(verb){
            reset({
             id: verb.id,
             verb: verb.verb,
             infinitive:"",
             simplePast: "",
             pastParticiple: "",
             INFINITIVE: verb.infinitive,
             SIMPLE_PAST: verb.simplePast,
             PAST_PARTICIPLE: verb.pastParticiple,
            })
        }
    } , [currentVerbIndex, filledVerbs, reset])

    return {
        showNextButton,
        showPreviewButton,
        control,
        formState,
        reset,
        setValue,
        handleNextVerb,
        handlePreviewVerb,
    }
}